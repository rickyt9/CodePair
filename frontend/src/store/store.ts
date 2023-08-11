import { configureStore } from '@reduxjs/toolkit';
import whiteboardSliceReducer from '../components/Whiteboard/whiteboardSlice';

export const store = configureStore({
  reducer: {
    whiteboard: whiteboardSliceReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['whiteboard/setElements'],
        ignoredPaths: ['whiteboard.elements'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
