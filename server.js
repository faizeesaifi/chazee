const WebSocket = require('ws');
const express = require('express');
const app = express();

app.use(express.static('public'));

const server = app.listen(process.env.PORT || 3000, () => {
  console.log(`Server running on port ${server.address().port}`);
});

const wss = new WebSocket.Server({ server, path: '/5qyz7i' });

wss.on('connection', (ws) => {
  console.log('Client connected');
  ws.send(JSON.stringify({ type: 'welcome', message: 'Connected to WebSocket server!' }));

  ws.on('message', (message) => {
    console.log('Received:', message.toString());
    try {
      const data = JSON.parse(message);
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(data));
        }
      });
    } catch (err) {
      console.error('Message parse error:', err);
      ws.send(JSON.stringify({ type: 'error', message: `Invalid JSON: ${err.message}` }));
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});

console.log('WebSocket server running');
