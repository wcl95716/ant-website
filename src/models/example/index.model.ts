import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { IExampleStateType } from './index.type';

// get state from http://127.0.0.1:5000/getVideosDetail
export const getTestRequest = createAsyncThunk('test/getTestRequest', async () => {
  const response = await fetch('http://127.0.0.1:5000/getVideosDetail');
  return response.json();
});

const initialState: IExampleStateType = {
  name: 'test',
};

// store initData
const exampleSlice = createSlice({
  name: 'example',
  initialState,
  reducers: {
    init: (state, action) => {
      state.name = action.payload;
    },
    changeData: (state) => {
      state.name = '456';
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getTestRequest.fulfilled, (state, action) => {
      state.name = action.payload;
    });
  },
});

export const { init, changeData } = exampleSlice.actions;

// selector
export const selectStateName = (storeModels: RootState) => storeModels.exampleData.name;
export default exampleSlice.reducer;
// Path: src\componens\video\index.tsx
