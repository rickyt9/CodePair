import { CursorPosition } from '../../../utils/types';

export const getResizedCoordinates = (
  clientX: number,
  clientY: number,
  position: CursorPosition,
  coordinates: any
) => {
  const { startPoint, endPoint } = coordinates;
  const { x: x1, y: y1 } = startPoint;
  const { x: x2, y: y2 } = endPoint;
  switch (position) {
    case CursorPosition.START:
    case CursorPosition.TOP_LEFT:
      return { x1: clientX, y1: clientY, x2, y2 };
    case CursorPosition.TOP_RIGHT:
      return { x1, y1: clientY, x2: clientX, y2 };
    case CursorPosition.BOTTOM_LEFT:
      return { x1: clientX, y1, x2, y2: clientY };
    case CursorPosition.END:
    case CursorPosition.BOTTOM_RIGHT:
      return { x1, y1, x2: clientX, y2: clientY };
    default:
      return null;
  }
};
