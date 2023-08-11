import { RoughCanvas } from 'roughjs/bin/canvas';
import { ToolType, Shape } from '../../../utils/types';
import { getStroke } from 'perfect-freehand';
import { getSvgPathFromStroke } from '.';

const drawPencilElement = (
  context: CanvasRenderingContext2D,
  element: Shape
) => {
  const myStroke = getStroke(element.points!, {
    size: 3,
  });
  const pathData = getSvgPathFromStroke(myStroke);
  const myPath = new Path2D(pathData);
  context.fill(myPath);
};

const drawTextElement = (context: CanvasRenderingContext2D, element: Shape) => {
  const { x: x1, y: y1 } = element.startPoint!;
  context.textBaseline = 'top';
  context.font = '24px sans-serif';
  context.fillText(element.text!, x1, y1);
};

export const drawElement = (
  roughCanvas: RoughCanvas,
  context: CanvasRenderingContext2D,
  element: Shape
) => {
  switch (element.toolType) {
    case ToolType.LINE:
    case ToolType.RECTANGLE:
      return roughCanvas.draw(element.drawable!);
    case ToolType.PENCIL:
      drawPencilElement(context, element);
      break;
    case ToolType.TEXT:
      drawTextElement(context, element);
      break;
    default:
      throw new Error('Something went wrong in drawElement');
  }
};
