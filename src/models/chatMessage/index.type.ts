export interface IChatMessage {
    priority: number;
    state: number;
    record_type: number;
    content: string;
    title: string;
    user_id: string;
    room_id: string;
    url: string;
    id?: number;
    uu_id: string;
}
export interface IUsersChatRecord {
    [id: string]: IChatMessage[];
}
