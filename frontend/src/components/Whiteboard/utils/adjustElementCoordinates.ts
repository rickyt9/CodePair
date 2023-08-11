import { ToolType, Shape } from '../../../utils/types';

export const adjustElementCoordinates = (element: Shape) => {
  const { startPoint, endPoint, toolType } = element;
  const { x: x1, y: y1 } = startPoint!;
  const { x: x2, y: y2 } = endPoint!;
  if (toolType === ToolType.RECTANGLE) {
    const minX = Math.min(x1, x2);
    const maxX = Math.max(x1, x2);
    const minY = Math.min(y1, y2);
    const maxY = Math.max(y1, y2);
    return { startPoint: { x: minX, y: minY }, endPoint: { x: maxX, y: maxY } };
  }
  if (toolType === ToolType.LINE) {
    if (x1 < x2 || (x1 === x2 && y1 < y2)) {
      // Drawing started from left to right
      return { startPoint, endPoint };
    } else {
      return { startPoint: endPoint, endPoint: startPoint };
    }
  }
};
