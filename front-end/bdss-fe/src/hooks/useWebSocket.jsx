import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    useRef,
    useCallback,
} from "react";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import { toast } from "react-toastify";

const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const [isConnected, setIsConnected] = useState(false);
    const stompClientRef = useRef(null);
    const reconnectTimeoutRef = useRef(null);

    const getStoredUser = () => {
        try {
            const stored = localStorage.getItem("user");
            return stored ? JSON.parse(stored) : null;
        } catch (e) {
            console.error("Lỗi khi đọc user từ localStorage:", e);
            return null;
        }
    };

    const connectWebSocket = useCallback(() => {
        const currentUser = getStoredUser();
        console.log("currentUser từ localStorage:", currentUser);

        if (!currentUser || currentUser.role !== "STAFF") {
            console.warn("Không phải STAFF, không kết nối WebSocket emergency");
            return;
        }

        if (stompClientRef.current && stompClientRef.current.connected) {
            console.log("STOMP client đã kết nối.");
            setIsConnected(true);
            return;
        }

        console.log("Đang cố gắng kết nối tới WebSocket...");

        const stompClient = Stomp.over(() => new SockJS("http://localhost:8080/ws"));
        stompClient.debug = () => {};

        stompClient.connect(
            {},
            (frame) => {
                console.log("Đã kết nối: " + frame);
                setIsConnected(true);

                if (reconnectTimeoutRef.current) {
                    clearTimeout(reconnectTimeoutRef.current);
                    reconnectTimeoutRef.current = null;
                }

                stompClient.subscribe("/topic/emergency", (message) => {
                    console.log("Đã nhận /topic/emergency");

                    const notification = JSON.parse(message.body);
                    console.log("Nội dung thông báo:", notification);

                    setNotifications((prev) => {
                        if (prev.some((n) => n.message === notification.message)) return prev;
                        return [...prev, notification];
                    });

                    toast.error(`KHẨN CẤP: ${notification.message}`, {
                        position: "top-right",
                        autoClose: 10000000,
                        theme: "colored",
                    });
                });
            },
            (error) => {
                console.error("Lỗi kết nối STOMP:", error);
                setIsConnected(false);

                toast.error("Mất kết nối WebSocket. Đang thử kết nối lại...", {
                    position: "top-right",
                });

                if (!reconnectTimeoutRef.current) {
                    reconnectTimeoutRef.current = setTimeout(() => {
                        connectWebSocket();
                    }, 5000);
                }
            }
        );

        stompClientRef.current = stompClient;
    }, []);

    const disconnectWebSocket = useCallback(() => {
        if (stompClientRef.current) {
            console.log("Ngắt kết nối WebSocket...");
            stompClientRef.current.deactivate();
            setIsConnected(false);
            stompClientRef.current = null;

            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
                reconnectTimeoutRef.current = null;
            }
        }
    }, []);

    useEffect(() => {
        const storedUserRaw = localStorage.getItem("user");
        const storedUser = storedUserRaw ? JSON.parse(storedUserRaw) : null;

        console.log("currentUser từ localStorage:", storedUser);

        if (storedUser?.role === "STAFF") {
            console.log("user đủ điều kiện, bắt đầu kết nối WebSocket");
            connectWebSocket();
            return () => {
                disconnectWebSocket();
            };
        } else {
            console.warn("Không phải STAFF => Ngắt kết nối WebSocket nếu có");
            disconnectWebSocket();
        }
    }, []);


    return (
        <WebSocketContext.Provider
            value={{
                notifications,
                isConnected,
                connectWebSocket,
                disconnectWebSocket,
            }}
        >
            {children}
        </WebSocketContext.Provider>
    );
};

export const useWebSocket = () => {
    const context = useContext(WebSocketContext);
    if (context === undefined) {
        throw new Error("useWebSocket phải được sử dụng bên trong một WebSocketProvider");
    }
    return context;
};
