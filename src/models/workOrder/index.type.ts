export interface IWorkItemStateType {
    name: string;
    isRefresh: boolean;
}

// - NEW: 0 代表新建状态。
// - IN_PROGRESS: 1 代表进行中状态。
// - COMPLETED: 2 代表已完成状态。
// - CLOSED: 3 代表已关闭状态。

export enum WorkItemState {
    NEW = 0,
    IN_PROGRESS = 1,
    COMPLETED = 2,
    CLOSED = 3,
}

export interface IWorkItem {
    id: string;
    title: string;
    type?: number;
    state?: WorkItemState;
    priority?: number;
    content?: string;
    creator_id?: string;
    assigned_to_id?: string;
    updateAt?: string;
    createAt?: string;
}
