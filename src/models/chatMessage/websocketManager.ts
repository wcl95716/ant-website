// websocketManager.ts
import { v4 as uuidv4 } from 'uuid';

class WebSocketManager {
    private websockets: Record<string, WebSocket> = {};
    private messageHandlers: Record<string, ((data: any) => void)[]> = {};
    private clientId: string = uuidv4();
    connect(roomId: string) {
        const url = `ws://192.168.50.147:25432/CharMessageAPI/ws?user_id=${this.clientId}&room_id=${roomId}`;
        const websocket = new WebSocket(url);
        this.websockets[roomId] = websocket;
        this.messageHandlers[roomId] = [];

        websocket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            this.messageHandlers[roomId].forEach((handler) => handler(data));
        };
    }

    sendMessage(roomId: string, message: string) {
        const websocket = this.websockets[roomId];
        if (websocket) {
            websocket.send(message);
        }
    }

    addMessageHandler(roomId: string, handler: (data: any) => void) {
        if (!this.messageHandlers[roomId]) {
            this.messageHandlers[roomId] = [];
        }
        this.messageHandlers[roomId].push(handler);
    }

    removeMessageHandler(roomId: string, handler: (data: any) => void) {
        if (this.messageHandlers[roomId]) {
            this.messageHandlers[roomId] = this.messageHandlers[roomId].filter(
                (h) => h !== handler,
            );
        }
    }

    close(roomId: string) {
        const websocket = this.websockets[roomId];
        if (websocket) {
            websocket.close();
            delete this.websockets[roomId];
            delete this.messageHandlers[roomId];
        }
    }
}

export default new WebSocketManager();
