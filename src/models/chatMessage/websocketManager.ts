// 引入 UUID 库以生成唯一的客户端 ID
import { v4 as uuidv4 } from 'uuid';

class WebSocketManager {
    // 私有字典，用于存储每个房间 ID 对应的 WebSocket 实例
    private websockets: Record<string, WebSocket> = {};

    // 私有字典，用于存储每个房间的消息处理函数数组，以房间 ID 为键
    private messageHandlers: Record<string, ((data: any) => void)[]> = {};

    // 为每个 WebSocketManager 实例生成的唯一客户端 ID
    private clientId: string = uuidv4();

    // 为指定房间建立 WebSocket 连接的方法
    connect(roomId: string) {
        // 构建带有用户 ID 和房间 ID 参数的 WebSocket URL
        const url = `ws://panda-code.top/CharMessageAPI/ws?user_id=${this.clientId}&room_id=${roomId}`;
        const websocket = new WebSocket(url);

        // 在字典中存储对应房间 ID 的 WebSocket 对象
        this.websockets[roomId] = websocket;
        this.messageHandlers[roomId] = [];

        // 定义此 WebSocket 接收到消息时的行为
        websocket.onmessage = (event) => {
            // 解析收到的消息中的 JSON 数据
            const data = JSON.parse(event.data);
            // 对注册到该房间的所有处理函数执行处理操作
            this.messageHandlers[roomId].forEach((handler) => handler(data));
        };
    }

    // 为特定房间通过 WebSocket 发送消息的方法
    sendMessage(roomId: string, message: string) {
        const websocket = this.websockets[roomId];
        if (websocket) {
            websocket.send(message);
        }
    }

    // 为特定房间注册新的消息处理函数的方法
    addMessageHandler(roomId: string, handler: (data: any) => void) {
        if (!this.messageHandlers[roomId]) {
            this.messageHandlers[roomId] = [];
        }
        this.messageHandlers[roomId].push(handler);
    }

    // 为特定房间移除已存在的消息处理函数的方法
    removeMessageHandler(roomId: string, handler: (data: any) => void) {
        if (this.messageHandlers[roomId]) {
            // 过滤掉需要移除的处理函数
            this.messageHandlers[roomId] = this.messageHandlers[roomId].filter(
                (h) => h !== handler,
            );
        }
    }

    // 关闭特定房间的 WebSocket 连接的方法
    close(roomId: string) {
        const websocket = this.websockets[roomId];
        if (websocket) {
            websocket.close();
            // 清理资源，删除对 WebSocket 和其处理函数的引用
            delete this.websockets[roomId];
            delete this.messageHandlers[roomId];
        }
    }
}

// 导出 WebSocketManager 的单例实例
export default new WebSocketManager();
