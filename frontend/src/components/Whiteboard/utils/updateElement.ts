import { createElement } from '.';
import { ToolType, Shape } from '../../../utils/types';
import { store } from '../../../store/store';
import { setElements } from '../whiteboardSlice';
import { emitElementUpdate } from '../../../socketConn/socketConn';

export const updateElement = (
  shapeDesc: Shape,
  index: number,
  elements: Shape[]
) => {
  const elementsCopy = [...elements];
  switch (shapeDesc.toolType) {
    case ToolType.LINE:
    case ToolType.RECTANGLE:
      const updatedElement = createElement(shapeDesc);
      elementsCopy[index] = updatedElement;
      store.dispatch(setElements(elementsCopy));
      emitElementUpdate(updatedElement);
      break;

    case ToolType.PENCIL:
      const pencilElement = elementsCopy[index];
      elementsCopy[index] = {
        ...pencilElement,
        points: pencilElement.points?.concat({ ...shapeDesc.endPoint! }),
      };
      const updatedPencilElement = elementsCopy[index];
      store.dispatch(setElements(elementsCopy));
      emitElementUpdate(updatedPencilElement);
      break;

    case ToolType.TEXT:
      const canvas = document.getElementById('canvas') as HTMLCanvasElement;
      const textWidth = canvas
        ?.getContext('2d')
        ?.measureText(shapeDesc.text!).width;
      const textHeight = 24;
      elementsCopy[index] = {
        ...createElement({
          id: shapeDesc.id,
          startPoint: shapeDesc.startPoint,
          endPoint: {
            x: shapeDesc.startPoint!.x + textWidth!,
            y: shapeDesc.startPoint!.y + textHeight,
          },
          toolType: shapeDesc.toolType,
          text: shapeDesc.text,
        }),
      };
      const updatedTextElement = elementsCopy[index];
      store.dispatch(setElements(elementsCopy));
      emitElementUpdate(updatedTextElement);
      break;
    default:
      throw new Error('Something went wrong when updating element');
  }
};
