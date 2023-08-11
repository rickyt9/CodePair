import { ToolType, CursorPosition, Shape, Point } from '../../../utils/types';

const distance = (a: Point, b: Point) =>
  Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));

const onLine = (
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  x: number,
  y: number,
  maxDistance = 1
) => {
  const a = { x: x1, y: y1 };
  const b = { x: x2, y: y2 };
  const c = { x: x, y: y };

  const offset = distance(a, b) - (distance(a, c) + distance(b, c));
  console.log(offset);
  return Math.abs(offset) < maxDistance ? CursorPosition.INSIDE : undefined;
};

const nearPoint = (
  x: number,
  y: number,
  x1: number,
  y1: number,
  cursorPosition: CursorPosition
) => {
  return Math.abs(x - x1) < 5 && Math.abs(y - y1) < 5
    ? cursorPosition
    : undefined;
};

const positionWithinElement = (
  x: number,
  y: number,
  element: Shape
): CursorPosition | undefined => {
  console.log(element.toolType);
  switch (element.toolType) {
    case ToolType.RECTANGLE: {
      const { x: x1, y: y1 } = element.startPoint!;
      const { x: x2, y: y2 } = element.endPoint!;
      const topLeft = nearPoint(x, y, x1, y1, CursorPosition.TOP_LEFT);
      const topRight = nearPoint(x, y, x2, y1, CursorPosition.TOP_RIGHT);
      const bottomLeft = nearPoint(x, y, x1, y2, CursorPosition.BOTTOM_LEFT);
      const bottomRight = nearPoint(x, y, x2, y2, CursorPosition.BOTTOM_RIGHT);
      const inside =
        x >= x1 && x <= x2 && y >= y1 && y <= y2
          ? CursorPosition.INSIDE
          : undefined;
      return topLeft || topRight || bottomLeft || bottomRight || inside;
    }
    case ToolType.TEXT: {
      const { x: x1, y: y1 } = element.startPoint!;
      const { x: x2, y: y2 } = element.endPoint!;
      return x >= x1 && x <= x2 && y >= y1 && y <= y2
        ? CursorPosition.INSIDE
        : undefined;
    }
    case ToolType.LINE: {
      const { x: x1, y: y1 } = element.startPoint!;
      const { x: x2, y: y2 } = element.endPoint!;
      const on = onLine(x1, y1, x2, y2, x, y);
      const start = nearPoint(x, y, x1, y1, CursorPosition.START);
      const end = nearPoint(x, y, x2, y2, CursorPosition.END);

      console.log('ON', on);

      return start || end || on;
    }
    default:
      return undefined;
  }
};

export const getElementAtPosition = (
  x: number,
  y: number,
  elements: Shape[]
): Shape | undefined => {
  return elements
    .map((el) => ({
      ...el,
      position: positionWithinElement(x, y, el),
    }))
    .find((el) => el.position !== null && el.position !== undefined);
};
