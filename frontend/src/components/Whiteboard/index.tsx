import {
  createRef,
  useLayoutEffect,
  MouseEvent,
  useState,
  FocusEvent,
} from 'react';
import { useAppSelector, useAppDispatch } from '../../hooks';
import {
  updateElement,
  createElement,
  drawElement,
  adjustmentRequired,
  adjustElementCoordinates,
  getElementAtPosition,
  getCursorForPosition,
  getResizedCoordinates,
} from './utils';
import {
  ToolType,
  ActionType,
  Action,
  Shape,
  Point,
  CursorPosition,
} from '../../utils/types';
import { updateElementInStore } from './whiteboardSlice';
import { v4 as uuid } from 'uuid';
import rough from 'roughjs';

import Menu from '../Menu';

const Whiteboard = () => {
  const canvasRef = createRef<HTMLCanvasElement>();
  const textAreaRef = createRef<HTMLTextAreaElement>();
  const toolType = useAppSelector((state) => state.whiteboard.tool);
  const elements = useAppSelector((state) => state.whiteboard.elements);

  const [action, setAction] = useState<ActionType>(null);
  const [selectedElement, setSelectedElement] = useState<Shape | null>(null);

  const dispatch = useAppDispatch();
  console.log(action);
  console.log(selectedElement);

  useLayoutEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d');

    ctx?.clearRect(0, 0, canvas.width, canvas.height);
    const roughCanvas = rough.canvas(canvas);

    elements.forEach((element) => {
      drawElement(roughCanvas, ctx!, element);
    });
  }, [elements]);

  const computePointInCanvas = (event: MouseEvent): Point | void => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    return { x, y };
  }

  const handleMouseDown = (event: MouseEvent) => {
    const currentPoint = computePointInCanvas(event);
    const { x: clientX, y: clientY } = currentPoint!;

    if (selectedElement && action === Action.WRITING) return;

    switch (toolType) {
      case ToolType.RECTANGLE:
      case ToolType.LINE:
      case ToolType.PENCIL: {
        const element = createElement({
          startPoint: {
            x: clientX - canvasRef.current!.offsetLeft,
            y: clientY - canvasRef.current!.offsetTop,
          },
          endPoint: {
            x: clientX - canvasRef.current!.offsetLeft,
            y: clientY - canvasRef.current!.offsetTop,
          },
          toolType: toolType as ToolType,
          id: uuid(),
        });
        setAction(Action.DRAWING);
        setSelectedElement(element);
        dispatch(updateElementInStore(element));
        break;
      }
      case ToolType.TEXT: {
        const element = createElement({
          startPoint: { x: clientX, y: clientY },
          endPoint: { x: clientX, y: clientY },
          toolType: toolType as ToolType,
          id: uuid(),
        });
        setAction(Action.WRITING);
        setSelectedElement(element);
        dispatch(updateElementInStore(element));
        break;
      }
      case ToolType.SELECTION: {
        console.log('MOUSE DOWN EVENT');
        const element = getElementAtPosition(clientX, clientY, elements);

        if (
          element &&
          (element.toolType === ToolType.RECTANGLE ||
            element.toolType === ToolType.TEXT ||
            element.toolType === ToolType.LINE)
        ) {
          setAction(
            element.position! === CursorPosition.INSIDE
              ? Action.MOVING
              : Action.RESIZING
          );
        }

        const offsetX = clientX - element?.startPoint?.x!;
        const offsetY = clientY - element?.startPoint?.y!;
        setSelectedElement({ ...element, offsetX, offsetY } as Shape);
      }
    }
  };

  const handleMouseUp = () => {
    const selectedElementIndex = elements.findIndex(
      (el) => el.id === selectedElement?.id
    );
    if (selectedElementIndex !== -1) {
      if (action === Action.DRAWING || action === Action.RESIZING) {
        if (adjustmentRequired(elements[selectedElementIndex].toolType)) {
          const { startPoint, endPoint } = adjustElementCoordinates(
            elements[selectedElementIndex]
          )!;
          const newElementDesc = {
            ...elements[selectedElementIndex],
            startPoint: startPoint,
            endPoint: endPoint,
          };
          updateElement(newElementDesc, selectedElementIndex, elements);
        }
      }
    }

    setAction(null);
    setSelectedElement(null);
  };

  const handleMouseMove = (event: MouseEvent<HTMLCanvasElement>) => {
    const currentPoint = computePointInCanvas(event);
    const { x: clientX, y: clientY } = currentPoint!;

    if (action === Action.DRAWING) {
      // Find index of selected element
      const index = elements.findIndex((el) => el.id === selectedElement?.id);
      if (index !== -1) {
        const newShapeDesc = {
          ...elements[index],
          endPoint: {
            x: clientX - canvasRef.current!.scrollLeft,
            y: clientY - canvasRef.current!.scrollTop,
          } as Point,
        };
        updateElement(newShapeDesc, index, elements);
      }
    }

    if (toolType === ToolType.SELECTION) {
      console.log('REDUNDANT SEARCH OF ELEMENT');
      const element = getElementAtPosition(clientX, clientY, elements);
      canvasRef.current!.style!.cursor = element
        ? getCursorForPosition(element.position!)
        : 'default';
    }

    if (
      toolType === ToolType.SELECTION &&
      action === Action.MOVING &&
      selectedElement
    ) {
      const { startPoint, endPoint, offsetX, offsetY } = selectedElement;
      const width = endPoint!.x - startPoint!.x;
      const height = endPoint!.y - startPoint!.y;

      const newX1 = clientX - offsetX!;
      const newY1 = clientY - offsetY!;

      const index = elements.findIndex((el) => el.id === selectedElement.id);
      console.log(index);
      if (index !== -1) {
        updateElement(
          {
            ...selectedElement,
            startPoint: { x: newX1, y: newY1 },
            endPoint: { x: newX1 + width, y: newY1 + height },
          },
          index,
          elements
        );
      }
    }

    if (
      toolType === ToolType.SELECTION &&
      action === Action.RESIZING &&
      selectedElement
    ) {
      const { id, position, toolType, ...coordinates } = selectedElement;
      const { x1, y1, x2, y2 } = getResizedCoordinates(
        clientX,
        clientY,
        position!,
        coordinates
      )!;

      const selectedElementIndex = elements.findIndex(
        (el) => el.id === selectedElement.id
      );

      if (selectedElementIndex !== -1) {
        updateElement(
          {
            id,
            toolType,
            startPoint: { x: x1, y: y1 },
            endPoint: { x: x2, y: y2 },
          },
          selectedElementIndex,
          elements
        );
      }
    }
  };

  const handleTextAreaBlur = (event: FocusEvent<HTMLTextAreaElement>) => {
    const { id, startPoint, toolType } = selectedElement!;
    const index = elements.findIndex((el) => el.id === selectedElement?.id);
    if (index !== -1) {
      updateElement(
        { id, startPoint, toolType, text: event.target.value },
        index,
        elements
      );
      setAction(null);
      setSelectedElement(null);
    }
  };

  return (
    <div className='bg-white relative'>
      <Menu />
      {action === Action.WRITING ? (
        <textarea
          ref={textAreaRef}
          onBlur={handleTextAreaBlur}
          style={{
            position: 'absolute',
            top: selectedElement?.startPoint?.y! - 3,
            left: selectedElement?.startPoint?.x!,
            font: '24px sans-serif',
            border: 0,
            outline: 0,
            resize: 'both',
            overflow: 'hidden',
            whiteSpace: 'pre',
            background: 'transparent',
          }}
        />
      ) : null}
      <canvas
        id='canvas'
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        ref={canvasRef}
        width={window.innerWidth}
        height={window.innerHeight}
      />
    </div>
  );
};

export default Whiteboard;
