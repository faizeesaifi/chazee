const WebSocket = require('ws');
const express = require('express');
const app = express();

app.use(express.static('public'));

const server = app.listen(process.env.PORT || 3000);
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  console.log('Client connected');
  ws.send('Welcome to the WebSocket server!');
  
  ws.on('message', (message) => {
    console.log('Received:', message.toString());
    // Broadcast to all connected clients
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(`Message: ${message}`);
      }
    });
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

console.log('Server running');
