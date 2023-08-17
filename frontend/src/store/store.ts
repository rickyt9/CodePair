import { configureStore } from '@reduxjs/toolkit';
import whiteboardSliceReducer from '../components/Whiteboard/whiteboardSlice';
import editorSliceReducer from './slices/editorSlice';

export const store = configureStore({
  reducer: {
    whiteboard: whiteboardSliceReducer,
    editor: editorSliceReducer,
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
