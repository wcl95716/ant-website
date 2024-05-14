// 导入 Redux Toolkit 和其他必要的模块
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import store, { RootState } from '../store';

import { IChatMessage } from './index.type';
import WebSocketManager from './websocketManager';

// 打开一个名为 'chat' 的数据库，并创建一个名为 'messages' 的对象存储
// async function initDB() {
//     const db = await openDB('chatAppDB', 1, {
//         upgrade(db) {
//             // 创建对象存储空间，如果不存在
//             if (!db.objectStoreNames.contains('messages')) {
//                 const store = db.createObjectStore(
//                     'messages', {keyPath : 'uu_id', autoIncrement : true});
//                 // 创建索引以便按 roomId 查找消息
//                 store.createIndex('byRoom', 'roomId');
//             }
//         },
//     });
//     return db;
// }

// async function saveMessage(db, message) {
//     const tx = db.transaction('messages', 'readwrite');
//     const store = tx.objectStore('messages');
//     await store.put(message);
//     await tx.done;
// }

// async function loadMessages(db, roomId) {
//     const tx = db.transaction('messages', 'readonly');
//     const store = tx.objectStore('messages');
//     const index = store.index('roomId');
//     const messages = await index.getAll(IDBKeyRange.only(roomId));
//     await tx.done;
//     return messages;
// }

// 获取历史消息，传递 roomId 作为参数
export const getHistoryMessagesRequest = createAsyncThunk(
    'test/getHistoryMessagesRequest',
    async (
        {
            roomId,
            current = 1,
            pageSize = 10,
        }: { roomId: string; current?: number; pageSize?: number },
        { rejectWithValue },
    ) => {
        try {
            const url = new URL('http://127.0.0.1:25432/ChatMessageAPI/room');
            url.searchParams.append('room_id', roomId);
            url.searchParams.append('current', current.toString());
            url.searchParams.append('pageSize', pageSize.toString());

            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Failed to fetch history messages');
            }
            return await response.json();
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    },
);

// 定义 WebSocket 的状态类型
interface WebSocketState {
    messages: Record<string, IChatMessage[]>;
    // 判断消息是否发送回来
    loadingMessages: Record<string, IChatMessage[]>;
}

// 定义初始状态
const initialState: WebSocketState = {
    messages: {},
    loadingMessages: {},
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
            console.log('state.messages[roomId]', action.payload);

            // 根据 uu_id 删除 loadingMessages 相同的数据
            if (state.loadingMessages[roomId]) {
                const index = state.loadingMessages[roomId].findIndex(
                    (item) => item.uu_id === action.payload.uu_id,
                );
                if (index > -1) {
                    state.loadingMessages[roomId].splice(index, 1);
                }
            }
        },
        // 初始化 WebSocket 连接
        initWebSocket(state, action: PayloadAction<{ roomId: string }>) {
            const { roomId } = action.payload;
            // 连接到 WebSocket 服务器
            WebSocketManager.connect(roomId);
            // 添加一个处理消息的函数
            WebSocketManager.addMessageHandler(roomId, (data: IChatMessage) => {
                // 当收到消息时，分发一个 receiveMessage action
                // eslint-disable-next-line @typescript-eslint/no-use-before-define
                store.dispatch(receiveMessage(data));
            });

            // 加载历史数据
        },
        // 发送消息
        sendMessage(state, action: PayloadAction<{ roomId: string; message: IChatMessage }>) {
            // 将消息发送到 WebSocket 服务器
            const { roomId, message } = action.payload;

            WebSocketManager.sendMessage(
                action.payload.roomId,
                JSON.stringify(action.payload.message),
            );
            // 临时显示刚刚发送的消息
            if (!state.loadingMessages[roomId]) {
                state.loadingMessages[roomId] = [];
            }
            // 将新的消息添加到这个房间的消息数组中
            state.loadingMessages[roomId].push(message);
        },
        // 可添加其他只处理数据的 reducer
    },
    extraReducers: (builder) => {
        builder.addCase(getHistoryMessagesRequest.fulfilled, (state, action) => {
            const { roomId, current } = action.meta.arg;
            console.log('messages', action.payload);
            const messages: IChatMessage[] = action.payload;
            if (!state.messages[roomId]) {
                state.messages[roomId] = [];
            }
            // 若是第一页，重置消息，否则追加消息
            if (current === 1) {
                state.messages[roomId] = messages;
            } else {
                state.messages[roomId].push(...messages);
            }
        });
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
export const selectLoadingMessagesByRoomId = (
    state: RootState,
    roomId: string,
): IChatMessage[] | undefined => {
    return state.chatMessage.loadingMessages[roomId];
};
