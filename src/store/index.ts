import { configureStore } from '@reduxjs/toolkit';
import creditReducer from './creditSlice';
import chatReducer from './chatSlice';

export const store = configureStore({
  reducer: {
    credit: creditReducer,
    chat: chatReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
