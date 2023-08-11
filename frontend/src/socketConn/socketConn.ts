import { io } from 'socket.io-client';
import {
  setElements,
  updateElementInStore,
} from '../components/Whiteboard/whiteboardSlice';
import { store } from '../store/store';
import { Shape } from '../utils/types';

export const socket = io('/');

export const connectWithSocketServer = () => {
  socket.on('connect', () => {
    console.log('connected to socket.io server');
  });

  socket.on('whiteboard-state', (elements) => {
    store.dispatch(setElements(elements));
  });

  socket.on('element-update', (elementData) => {
    store.dispatch(updateElementInStore(elementData));
  });

  socket.on('whiteboard-clear', () => {
    store.dispatch(setElements([]));
  });
};

export const emitElementUpdate = (elementData: Shape) => {
  socket.emit('element-update', elementData);
};

export const emitClearWhiteboard = () => {
  socket.emit('whiteboard-clear');
};
