# CodePair

## Description
CodePair is web application that allows people to have coding interviews online. Because sometimes it's hard to explain yourself with just words, this application features a whiteboard where the interviewee can draw their ideas as they would with a real life whiteboard and the interviewer will be able to see the drawing in real time. While the core of the application is composed of these features mentioned above, the code editor and the whiteboard, I still considered as a nice learning experience/challenge to add video calls and add chat messages via WebRTC.

The initial communication between peers and the real time capabilities are implemented via websockets, mainly socket.io. A signaling server was developed using socket.io that transmits the necessary information (offer, answer and ICE candidates) between two clients so they can be directly connected and have a smooth video call experience. Additionally, the application handles rooms via the socket.io API, allowing to isolate two people so they can exchange information exclusively between them. This would also allow multiple people to perform coding interviews simultaneously as their data is not exchanged between them.

The idea of the project came up after continuosly doing coding problems in preparation for interviews. It's often the case where we (candidates) support our thought process with drawings in notebooks that later we would have to show or would like to show to the interviewer, a part of coding interviews which was somewhat lost in the transition to the online world. The goal is to provide a whiteboard with tools specific to coding interviews and directly related to data structures so the user can easily manipulate their drawings without spending too much time in them.

## Example

## Status - Ongoing
Currently, the project is still in development, it is planned to be finished by mid september. The project mainly needs a refactoring to have proper separation of concerns in different files. The core functionalities, code editor and whiteboard, are working for most use cases, still need to handle a few error cases. 

### Implemented Features
Among the features that are already implemented are the following:
* Code Editor with syntax highlighting and autocompletion.
* Real time updates of the code editor as any person makes changes.
* Whiteboard tab, giving access to the drawing board.
* Basic tools for the drawing board, providing the most basic shapes.
* Resizing and moving shapes already drawn in the whiteboard.
* Establishing a WebRTC connection between the clients in a given room.
* Real time updates of the whiteboard as any person draws something.

### Pending Features
Some of the pending features meant to be fixed/added are:
* Video call services in the room.
* Addition of chat messages for the people in a given room.
* Ability to switch programming language for the code editor.
* Add more shapes to the drawing board tools.
* Ability to change color of the pencil.
* Redirect users to an error screen when attempting to join a full room.

### Possible features
Some features that could be added but for now are not part of the main deliverable are the following:
* Adding snapping and grouping functionalities to the shapes in the board.
* Adding tools to quickly build arrays, graphs, and linked lists.
* Adding an undo command to the whiteboard to restore changes.
* Changing the theme of the application and code editor.

## Technologies and Libraries
React, ReduxToolkit, TailwindCSS, WebRTC, Socket.io, Rough.js, perfect-freehand,

## Installation
1. Clone the repository
2. Navigate to the frontend folder and install dependencies using `npm install`
3. Navigate to the backend folder and install dependencies using `npm install`
4. To start the server, once located in the backend folder run `npm run start`
5. Start the frontnd server by navigating to the frontend folder and run `npm run dev`

After following those steps both the backend server and the frontend server should be running. In a browser tab, go to http://127.0.0.1:5173/, which is the port where vite runs the server and the app will be running.
