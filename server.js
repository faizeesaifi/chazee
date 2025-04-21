const express = require('express');
const http = require('http');
const { Server } = require('ws'); // WebSocket server

const app = express();
const server = http.createServer(app); // HTTP server
const wss = new Server({ server }); // WebSocket server attach

// Static files serve karne ke liye (website)
app.use(express.static('public'));

// Connected devices ka Map
const devices = new Map();

wss.on('connection', (ws) => {
  let deviceID = null;

  console.log('New client connected');

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);

      if (data.deviceID && !deviceID) {
        deviceID = data.deviceID;
        devices.set(deviceID, ws);
        console.log(`Device connected: ${deviceID}`);
        broadcastDeviceList();
      }

      if (data.type === 'data') {
        console.log(`Data from ${deviceID}: ${data.payload}`);
        broadcastData(deviceID, data.payload);
      }
    } catch (err) {
      console.log(`Error parsing message: ${err}`);
    }
  });

  ws.on('close', () => {
    if (deviceID) {
      devices.delete(deviceID);
      console.log(`Device disconnected: ${deviceID}`);
      broadcastDeviceList();
    }
  });
});

// Connected devices ki list broadcast karo
function broadcastDeviceList() {
  const deviceList = Array.from(devices.keys());
  const message = JSON.stringify({ type: 'deviceList', devices: deviceList });
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

// Device data broadcast karo
function broadcastData(deviceID, payload) {
  const message = JSON.stringify({ type: 'data', deviceID, payload });
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

// Server start karo with dynamic port
const PORT = process.env.PORT || 443; // Default to 443 for wss
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
