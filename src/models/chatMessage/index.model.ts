// Redux Slice (websocketSlice.ts)
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import store, { RootState } from '../store';
import { IChatMessage } from './index.type';
import WebSocketManager from './websocketManager';

interface WebSocketState {
    messages: Record<string, IChatMessage[]>;
}

const initialState: WebSocketState = {
    messages: {},
};

const websocketSlice = createSlice({
    name: 'websocket',
    initialState,
    reducers: {
        receiveMessage(state, action: PayloadAction<IChatMessage>) {
            const roomId = action.payload.room_id;

            if (!state.messages[roomId]) {
                state.messages[roomId] = [];
            }
            state.messages[roomId].push(action.payload);
        },
        initWebSocket(state, action: PayloadAction<{ roomId: string }>) {
            const { roomId } = action.payload;
            WebSocketManager.connect(roomId);
            WebSocketManager.addMessageHandler(roomId, (data: any) => {
                // eslint-disable-next-line @typescript-eslint/no-use-before-define
                store.dispatch(receiveMessage(data));
            });
        },
        sendMessage(state, action: PayloadAction<{ roomId: string; message: IChatMessage }>) {
            WebSocketManager.sendMessage(
                action.payload.roomId,
                JSON.stringify(action.payload.message),
            );
        },
        // 可添加其他只处理数据的 reducer
    },
});

export const { initWebSocket, receiveMessage, sendMessage } = websocketSlice.actions;

export default websocketSlice.reducer;

// Selectors
export const selectMessagesByRoomId = (
    state: RootState,
    roomId: string,
): IChatMessage[] | undefined => {
    return state.chatMessage.messages[roomId];
};
