import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import request from 'umi-request';
import { RootState } from '../store';
import { IWorkItem, IWorkItemStateType } from './index.type';

// get state from http://127.0.0.1:5000/getVideosDetail
export const getTestRequest = createAsyncThunk('test/getTestRequest', async () => {
    const response = await fetch('https://panda-code.top/getVideosDetail');
    return response.json();
});

//   curl -X 'POST' \
//   'https://panda-code.top/WorkOrderAPI' \
//   -H 'accept: application/json' \
//   -H 'Content-Type: application/json' \
//   -d '{
//   "type": 1,
//   "content": "string",
//   "title": "string",
//   "creator_id": "string",
//   "assigned_to_id": "string",
//   "state": 1,
//   "priority": 1
// }'
// 创建工单

export const createWorkOrder = createAsyncThunk(
    'workOrder/createWorkOrder',
    async (workItem: IWorkItem) => {
        const response = await fetch('https://panda-code.top/WorkOrderAPI', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(workItem),
        });
        return response.json();
    },
);

export const deleteWorkOrder = createAsyncThunk('workOrder/deleteWorkOrder', async (id: string) => {
    const response = await request.delete(`https://panda-code.top/WorkOrderAPI`, {
        params: { id: id },
    });
    return response.json();
});

export const updateWorkOrder = createAsyncThunk(
    'workOrder/updateWorkOrder',
    async (workItem: IWorkItem) => {
        const response = await request.put(`https://panda-code.top/WorkOrderAPI`, {
            data: workItem,
        });
        return response.json();
    },
);

const initialState: IWorkItemStateType = {
    name: 'test',
    isRefresh: false,
};

// store initData
const workItemSlice = createSlice({
    name: 'example',
    initialState,
    reducers: {
        init: (state, action) => {
            state.name = action.payload;
        },
        changeData: (state) => {
            state.name = '456';
        },
        refresh: (state) => {
            state.isRefresh = !state.isRefresh;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getTestRequest.fulfilled, (state, action) => {
            state.name = action.payload;
        });
    },
});

export const { init, changeData, refresh } = workItemSlice.actions;

// selector
export const selectRefresh = (storeModels: RootState) => storeModels.workItem.isRefresh;
export default workItemSlice.reducer;
// Path: src\componens\video\index.tsx
