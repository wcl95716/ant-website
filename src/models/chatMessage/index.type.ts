export interface IChatMessage {
    priority?: number;
    state?: number;
    url?: string;
    id?: number;
    uu_id?: string;
    record_type: number;
    content: string;
    title: string;
    user_id: string;
    room_id: string;
    created_at?: string;
    updated_at?: string;
}

export interface IUsersChatRecord {
    [id: string]: IChatMessage[];
}
