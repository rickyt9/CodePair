import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ToolType, Shape } from '../../utils/types';

type WhiteboardState = {
  tool: ToolType | null;
  elements: Shape[];
}

const initialState: WhiteboardState = {
  tool: null,
  elements: [],
};

const whiteboardSlice = createSlice({
  name: 'whiteboard',
  initialState,
  reducers: {
    setToolType: (state, action: PayloadAction<ToolType>) => {
      state.tool = action.payload;
    },
    updateElementInStore: (state, action: PayloadAction<Shape>) => {
      const { id } = action.payload;
      const index = state.elements.findIndex((element) => element.id === id);
      if (index === -1) {
        state.elements.push(action.payload);
      } else {
        // If index is found, update the element in our array of elements
        state.elements[index] = action.payload;
      }
    },
    setElements: (state, action: PayloadAction<Shape[]>) => {
      state.elements = action.payload;
    },
  },
});

export const { setToolType, updateElementInStore, setElements } =
  whiteboardSlice.actions;
export default whiteboardSlice.reducer;
