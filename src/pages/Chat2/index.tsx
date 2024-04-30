// components/ChatRoom.tsx
import {
    initWebSocket,
    selectMessagesByRoomId,
    sendMessage,
} from '@/models/chatMessage/index.model';
import { IChatMessage } from '@/models/chatMessage/index.type';
import { useAppDispatch, useAppSelector } from '@/models/store';
import React, { useEffect, useState } from 'react';

// interface ChatRoomProps {
//     userId: string;
//     roomId: string;
// }

const ChatRoom: React.FC = () => {
    const roomId = 'test';
    const userId = 'test2';

    const dispatch = useAppDispatch();
    const messages = useAppSelector((state) =>
        roomId ? selectMessagesByRoomId(state, roomId) : [],
    );

    const [newMessage, setNewMessage] = useState('');

    useEffect(() => {
        dispatch(initWebSocket({ roomId }));
    }, [userId, roomId, dispatch]);

    const handleSendMessage = () => {
        if (newMessage.trim()) {
            const messageData: IChatMessage = {
                priority: 2, // Assume some priority, change as needed
                state: 0, // Assume some state, change as needed
                record_type: 1, // Assume some record type, change as needed
                content: newMessage,
                title: 'title',
                user_id: userId,
                room_id: roomId,
                url: '',
                uu_id: `${Date.now()}-${userId}`, // Construct a unique identifier
            };
            dispatch(sendMessage({ roomId: roomId, message: messageData }));
            setNewMessage('');
        }
    };

    const updateField =
        (setter: React.Dispatch<React.SetStateAction<string>>) =>
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setter(e.target.value);
        };

    return (
        <div>
            <h2>Chat Room: {roomId}</h2>
            <ul>
                {messages?.map((msg, index) => {
                    // console.log('index ', index, msg.content);
                    return <li key={index}>{msg.content}</li>;
                })}
            </ul>

            <input
                type="text"
                placeholder="Message"
                value={newMessage}
                onChange={updateField(setNewMessage)}
            />

            <button type="button" onClick={handleSendMessage}>
                Send
            </button>
        </div>
    );
};

export default ChatRoom;
