import React, {
    useState,
    useEffect,
    useRef,
    useCallback,
} from "react";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import { toast } from "react-toastify";
import { WebSocketContext } from "./webSocketContext";

export const WebSocketProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const [isConnected, setIsConnected] = useState(false);
    const stompClientRef = useRef(null);
    const reconnectTimeoutRef = useRef(null);

    const getStoredUser = useCallback(() => {
        try {
            const stored = localStorage.getItem("user");
            return stored ? JSON.parse(stored) : null;
        } catch (error) {
            console.error("Unable to read user from localStorage:", error);
            return null;
        }
    }, []);

    const getStoredRole = useCallback(() => {
        const currentUser = getStoredUser();
        if (!currentUser) {
            return null;
        }
        return Array.isArray(currentUser.role) ? currentUser.role[0] : currentUser.role;
    }, [getStoredUser]);

    const connectWebSocket = useCallback(() => {
        const currentUser = getStoredUser();
        const currentRole = Array.isArray(currentUser?.role)
            ? currentUser.role[0]
            : currentUser?.role;

        if (!currentUser || currentRole !== "STAFF") {
            return;
        }

        if (stompClientRef.current && stompClientRef.current.connected) {
            setIsConnected(true);
            return;
        }

        const stompClient = Stomp.over(() => new SockJS("http://localhost:8080/ws"));
        stompClient.debug = () => {};

        stompClient.connect(
            {},
            () => {
                setIsConnected(true);

                if (reconnectTimeoutRef.current) {
                    clearTimeout(reconnectTimeoutRef.current);
                    reconnectTimeoutRef.current = null;
                }

                stompClient.subscribe("/topic/emergency", (message) => {
                    const notification = JSON.parse(message.body);

                    setNotifications((previousNotifications) => {
                        if (previousNotifications.some((item) => item.message === notification.message)) {
                            return previousNotifications;
                        }
                        return [...previousNotifications, notification];
                    });

                    toast.error(`KHAN CAP: ${notification.message}`, {
                        position: "top-right",
                        autoClose: 10000000,
                        theme: "colored",
                    });
                });
            },
            (error) => {
                console.error("STOMP connection error:", error);
                setIsConnected(false);

                toast.error("Mat ket noi WebSocket. Dang thu ket noi lai...", {
                    position: "top-right",
                });

                if (!reconnectTimeoutRef.current && getStoredRole() === "STAFF") {
                    reconnectTimeoutRef.current = setTimeout(() => {
                        connectWebSocket();
                    }, 5000);
                }
            }
        );

        stompClientRef.current = stompClient;
    }, [getStoredRole, getStoredUser]);

    const disconnectWebSocket = useCallback(() => {
        if (stompClientRef.current) {
            stompClientRef.current.deactivate();
            stompClientRef.current = null;
        }

        if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
            reconnectTimeoutRef.current = null;
        }

        setIsConnected(false);
    }, []);

    useEffect(() => {
        if (getStoredRole() === "STAFF") {
            connectWebSocket();
            return () => {
                disconnectWebSocket();
            };
        }

        disconnectWebSocket();
    }, [connectWebSocket, disconnectWebSocket, getStoredRole]);

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
