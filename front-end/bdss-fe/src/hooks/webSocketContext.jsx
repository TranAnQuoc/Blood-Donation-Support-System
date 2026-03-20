import { createContext, useContext } from "react";

export const WebSocketContext = createContext(null);

export const useWebSocket = () => {
    const context = useContext(WebSocketContext);

    if (context === null) {
        throw new Error("useWebSocket phai duoc su dung ben trong WebSocketProvider");
    }

    return context;
};
