import { CursorPosition } from '../../../utils/types';

export const getCursorForPosition = (position: CursorPosition) => {
  switch (position) {
    case CursorPosition.TOP_LEFT:
    case CursorPosition.BOTTOM_RIGHT:
    case CursorPosition.START:
    case CursorPosition.END:
      return 'nwse-resize';
    case CursorPosition.TOP_RIGHT:
    case CursorPosition.BOTTOM_LEFT:
      return 'nesw-resize';
    default:
      return 'move';
  }
};
