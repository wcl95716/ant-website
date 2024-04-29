// components/ChatRoom.tsx
import { receiveMessage, selectMessagesByRoomId } from '@/models/chatMessage/index.model';
import { IChatMessage } from '@/models/chatMessage/index.type';
import { useAppDispatch, useAppSelector } from '@/models/store';
import React, { useEffect, useRef, useState } from 'react';

// interface ChatRoomProps {
//     userId: string;
//     roomId: string;
// }

const ChatRoom: React.FC = () => {
    const roomId = 'test';
    const userId = 'test';

    const dispatch = useAppDispatch();
    const messages = useAppSelector((state) =>
        roomId ? selectMessagesByRoomId(state, roomId) : [],
    );
    const websocketRef = useRef<WebSocket | null>(null);
    const [newMessage, setNewMessage] = useState('');
    const [title, setTitle] = useState('');
    const [url, setUrl] = useState('');

    useEffect(() => {
        console.log('messages ', messages);
    }, [messages]);

    useEffect(() => {
        const socket = new WebSocket(
            `ws://localhost:25432/CharMessageAPI/ws?user_id=${userId}&room_id=${roomId}`,
        );
        socket.onmessage = (event) => {
            const data = JSON.parse(event.data); // 确保消息数据被解析成对象
            dispatch(receiveMessage({ roomId, message: data }));
        };
        socket.onopen = () => console.log('WebSocket opened.');
        socket.onclose = () => console.log('WebSocket closed.');
        websocketRef.current = socket;

        return () => {
            socket.close();
        };
    }, [userId, roomId, dispatch]);

    const handleSendMessage = () => {
        if (newMessage.trim()) {
            const messageData: IChatMessage = {
                priority: 2, // Assume some priority, change as needed
                state: 0, // Assume some state, change as needed
                record_type: 1, // Assume some record type, change as needed
                content: newMessage,
                title: title,
                user_id: userId,
                room_id: roomId,
                url: url,
                uu_id: `${Date.now()}-${userId}`, // Construct a unique identifier
            };
            websocketRef.current?.send(JSON.stringify(messageData));
            // dispatch(receiveMessage({ roomId, message: event.data }));
            setNewMessage('');
            setTitle('');
            setUrl('');
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
                {/* {messages?.map((msg, index) => (

                    <li key={index}>{msg.content}</li>
                ))} */}

                {messages?.map((msg, index) => {
                    console.log('index ', index, msg.content);
                    return <li key={index}>{msg.content}</li>;
                })}
            </ul>
            <input type="text" placeholder="Title" value={title} onChange={updateField(setTitle)} />
            <input
                type="text"
                placeholder="Message"
                value={newMessage}
                onChange={updateField(setNewMessage)}
            />
            <input type="text" placeholder="URL" value={url} onChange={updateField(setUrl)} />

            <button type="button" onClick={handleSendMessage}>
                Send
            </button>
        </div>
    );
};

export default ChatRoom;
