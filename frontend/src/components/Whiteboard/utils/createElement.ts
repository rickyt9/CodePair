import { ToolType, Shape, Point } from '../../../utils/types';
import rough from 'roughjs';

const generator = rough.generator();

const generateRectangle = (startPoint: Point, endPoint: Point) => {
  const { x: x1, y: y1 } = startPoint;
  const { x: x2, y: y2 } = endPoint;
  return generator.rectangle(x1, y1, x2 - x1, y2 - y1);
};

const generateLine = (startPoint: Point, endPoint: Point) => {
  const { x: x1, y: y1 } = startPoint;
  const { x: x2, y: y2 } = endPoint;
  return generator.line(x1, y1, x2, y2);
};

export const createElement = (shapeDesc: Shape): Shape => {
  console.log('CREATING ELEMENT');
  let roughElement;
  const { startPoint, endPoint } = shapeDesc;
  switch (shapeDesc.toolType) {
    case ToolType.RECTANGLE:
      roughElement = generateRectangle(startPoint!, endPoint!);
      return {
        ...shapeDesc,
        drawable: roughElement,
      };
    case ToolType.LINE:
      roughElement = generateLine(startPoint!, endPoint!);
      return {
        ...shapeDesc,
        drawable: roughElement,
      };
    case ToolType.PENCIL:
      return {
        id: shapeDesc.id,
        toolType: shapeDesc.toolType,
        points: [{ ...startPoint! }],
      };
    case ToolType.TEXT:
      return {
        id: shapeDesc.id,
        toolType: shapeDesc.toolType,
        startPoint: shapeDesc.startPoint,
        endPoint: shapeDesc.endPoint,
        text: shapeDesc.text || '',
      };
    default:
      throw new Error('Something went wrong when creating element');
  }
};
