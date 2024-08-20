// index.js

import { TerminalUI } from "./TerminalUI";
import io from "socket.io-client";

// IMPORTANT: Make sure you replace this address with your server address.

const serverAddress = "http://NODE-IP:30001/";

//Server sandbox available at https://codesandbox.io/s/web-terminal-tutorial-server-g2ihu

function connectToSocket(serverAddress) {
  return new Promise(res => {
    const socket = io.connect(serverAddress, { transports: ['websocket'] });
    socket.on('connect', () => {
      console.log('Connected to server');
    });

      // Handle successful connection
      socket.on('connect', () => {
        console.log('Successfully connected to server');
        resolve(socket);
      });
  
      // Handle connection error
      socket.on('connect_error', (error) => {
        console.log('Connection error:', error.message);
        reject(error);
      });
    res(socket);
  });
}

function startTerminal(container, socket) {
  // Create an xterm.js instance (TerminalUI class is a wrapper with some utils. Check that file for info.)
  const terminal = new TerminalUI(socket);

  // Attach created terminal to a DOM element.
  terminal.attachTo(container);

  // When terminal attached to DOM, start listening for input, output events.
  // Check TerminalUI startListening() function for details.
  terminal.startListening();
}

function start() {
  const container = document.getElementById("terminal-container");
  // Connect to socket and when it is available, start terminal.
  connectToSocket(serverAddress).then(socket => {
    startTerminal(container, socket);
  });
}

// Better to start on DOMContentLoaded. So, we know terminal-container is loaded
start();
