import { IMessage } from 'react-chat-elements';

// 继承 IMessage 接口并重写 type 属性
export interface CustomMessage extends IMessage {
    type:
        | 'location'
        | 'photo'
        | 'video'
        | 'spotify'
        | 'audio'
        | 'meetingLink'
        | 'file'
        | 'text'
        | 'system'
        | 'meeting';
}
