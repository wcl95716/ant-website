// 导入 Redux Toolkit 和其他必要的模块
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import store, { RootState } from '../store';
import { IChatMessage } from './index.type';
import WebSocketManager from './websocketManager';

// 定义 WebSocket 的状态类型
interface WebSocketState {
    messages: Record<string, IChatMessage[]>;
}

// 定义初始状态
const initialState: WebSocketState = {
    messages: {},
};

// 使用 createSlice 创建一个新的 Redux slice
const websocketSlice = createSlice({
    name: 'websocket', // slice 的名称
    initialState, // 初始状态
    reducers: {
        // 定义这个 slice 的 reducer
        // 当收到消息时的处理
        receiveMessage(state, action: PayloadAction<IChatMessage>) {
            const roomId = action.payload.room_id;

            // 如果这个房间的消息数组还不存在，就创建一个新的数组
            if (!state.messages[roomId]) {
                state.messages[roomId] = [];
            }
            // 将新的消息添加到这个房间的消息数组中
            state.messages[roomId].push(action.payload);
        },
        // 初始化 WebSocket 连接
        initWebSocket(state, action: PayloadAction<{ roomId: string }>) {
            const { roomId } = action.payload;
            // 连接到 WebSocket 服务器
            WebSocketManager.connect(roomId);
            // 添加一个处理消息的函数
            WebSocketManager.addMessageHandler(roomId, (data: any) => {
                // 当收到消息时，分发一个 receiveMessage action
                // eslint-disable-next-line @typescript-eslint/no-use-before-define
                store.dispatch(receiveMessage(data));
            });
        },
        // 发送消息
        sendMessage(state, action: PayloadAction<{ roomId: string; message: IChatMessage }>) {
            // 将消息发送到 WebSocket 服务器
            WebSocketManager.sendMessage(
                action.payload.roomId,
                JSON.stringify(action.payload.message),
            );
        },
        // 可添加其他只处理数据的 reducer
    },
});

// 导出这个 slice 的 action 和 reducer
export const { initWebSocket, receiveMessage, sendMessage } = websocketSlice.actions;
export default websocketSlice.reducer;

// 定义一个 selector，用于从状态中选择一个房间的所有消息
export const selectMessagesByRoomId = (
    state: RootState,
    roomId: string,
): IChatMessage[] | undefined => {
    return state.chatMessage.messages[roomId];
};
