import { Drawable } from 'roughjs/bin/core';

export enum ToolType {
  RECTANGLE = 'RECTANGLE',
  LINE = 'LINE',
  PENCIL = 'PENCIL',
  TEXT = 'TEXT',
  SELECTION = 'SELECTION',
}

export enum Action {
  DRAWING = 'DRAWING',
  WRITING = 'WRITING',
  MOVING = 'MOVING',
  RESIZING = 'RESIZING',
}

export type ActionType = Action | null;

export enum CursorPosition {
  TOP_LEFT = 'TOP_LEFT',
  TOP_RIGHT = 'TOP_RIGHT',
  START = 'START',
  END = 'END',
  BOTTOM_LEFT = 'BOTTOM_LEFT',
  BOTTOM_RIGHT = 'BOTTOM_RIGHT',
  INSIDE = 'INSIDE',
}

export type Point = {
  x: number;
  y: number;
};

export interface Shape {
  id: string;
  startPoint?: Point;
  endPoint?: Point;
  toolType: ToolType;
  drawable?: Drawable;
  points?: Point[];
  text?: string;
  position?: CursorPosition;
  offsetX?: number;
  offsetY?: number;
}

// --------SAMPLE------------

// class NewShape {
//   id: string;
//   x1: number;
//   y1: number;
//   shapeType: string;

//   constructor() {
//     this.id = '';
//   }
// }

// class PencilShape extends NewShape {
//   points: number[];
//   constructor() {
//     super();
//     this.points = [];
//   }
// }

// class TextShape extends NewShape {
//   text: string;
//   constructor() {
//     super();
//     this.text = '';
//   }
// }
