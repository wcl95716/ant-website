// use configureStore to create a store

import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import chatMessageSliceReducer from './chatMessage/index.model';
import exampleSliceReducer from './example/index.model';
export const store = configureStore({
    reducer: {
        exampleData: exampleSliceReducer,
        chatMessage: chatMessageSliceReducer,
    },
});

// RootState is the type of the root state
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
