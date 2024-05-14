// components/ChatRoom.tsx
import {
    getHistoryMessagesRequest,
    initWebSocket,
    selectLoadingMessagesByRoomId,
    selectMessagesByRoomId,
    sendMessage,
} from '@/models/chatMessage/index.model';
import { IChatMessage } from '@/models/chatMessage/index.type';
import { useAppDispatch, useAppSelector } from '@/models/store';
import React, { useEffect, useState } from 'react';
import { MessageBox } from 'react-chat-elements';

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

    const loadingMessages = useAppSelector((state) =>
        roomId ? selectLoadingMessagesByRoomId(state, roomId) : [],
    );

    const [newMessage, setNewMessage] = useState('');

    useEffect(() => {
        dispatch(initWebSocket({ roomId }));
        dispatch(getHistoryMessagesRequest({ roomId, page: 1 }));
    }, [userId, roomId, dispatch]);

    const handleSendMessage = () => {
        if (newMessage.trim()) {
            const messageData: IChatMessage = {
                priority: 2,
                state: 0,
                record_type: 1,
                content: newMessage,
                created_at: new Date().toISOString(),
                title: 'title',
                user_id: userId,
                room_id: roomId,
                url: '',
                uu_id: `${Date.now()}-${userId}`,
            };
            console.log('messageData', messageData);
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
                    // return <li key={index}>{msg.content}</li>;
                    // use MessageBox
                    console.log('msg', msg);
                    return (
                        <MessageBox
                            key={index}
                            position={msg.user_id === userId ? 'right' : 'left'}
                            type={'text'}
                            text={msg.created_at}
                            date={msg.created_at}
                            // dateString={msg.created_at}
                        />
                    );
                })}
            </ul>
            <ul>
                {loadingMessages?.map((msg, index) => {
                    console.log('loading index ', index, msg.content);
                    return (
                        <MessageBox
                            key={index}
                            position={msg.user_id === userId ? 'right' : 'left'}
                            type={'text'}
                            text={msg.content}
                            date={msg.updated_at || new Date().getTime()}
                            status="waiting"
                        />
                    );
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
