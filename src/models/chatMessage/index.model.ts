// Redux Slice (websocketSlice.ts)
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { IChatMessage } from './index.type';

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
        receiveMessage(state, action: PayloadAction<{ roomId: string; message: IChatMessage }>) {
            const { roomId, message } = action.payload;
            if (!state.messages[roomId]) {
                state.messages[roomId] = [];
            }
            state.messages[roomId].push(message);
        },
        // 可添加其他只处理数据的 reducer
    },
});

export const { receiveMessage } = websocketSlice.actions;

export default websocketSlice.reducer;

// Selectors
export const selectMessagesByRoomId = (
    state: RootState,
    roomId: string,
): IChatMessage[] | undefined => {
    return state.chatMessage.messages[roomId];
};
