const express = require('express');
const http = require('http');
const { Server } = require('ws');
const app = express();
const server = http.createServer(app);
const wss = new Server({ server, path: '/5qyz7i' });
app.use(express.static('public'));
const devices = new Map();
wss.on('connection', (ws) => {
  let deviceID = null;
  console.log('New client connected');
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message.toString());
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
function broadcastDeviceList() {
  const deviceList = Array.from(devices.keys());
  const message = JSON.stringify({ type: 'deviceList', devices: deviceList });
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}
function broadcastData(deviceID, payload) {
  const message = JSON.stringify({ type: 'data', deviceID, payload });
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}
const PORT = process.env.PORT || 10000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
