import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type EditorState = {
  activePage: number;
};

const initialState: EditorState = {
  activePage: 0,
};

const editorSlice = createSlice({
  name: 'editor',
  initialState,
  reducers: {
    setActivePage: (state, action: PayloadAction<number>) => {
      state.activePage = action.payload;
    },
  },
});

export const { setActivePage } = editorSlice.actions;
export default editorSlice.reducer;
