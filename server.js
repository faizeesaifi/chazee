const WebSocket = require('ws');
const express = require('express');
const app = express();
const port = process.env.PORT || 8080;

// Static files serve karne ke liye (website)
app.use(express.static('public'));

// WebSocket server
const server = new WebSocket.Server({ server: app.listen(port) });

// Connected devices ka Map (deviceID -> WebSocket)
const devices = new Map();

server.on('connection', (ws) => {
  let deviceID = null; // Device ID store karne ke liye

  console.log('New client connected');

  ws.on('message', (message) => {
    try {
      // Message ko JSON parse karo
      const data = JSON.parse(message);

      // Agar message mein deviceID hai
      if (data.deviceID && !deviceID) {
        deviceID = data.deviceID;
        devices.set(deviceID, ws); // Device ko Map mein add karo
        console.log(`Device connected: ${deviceID}`);
        
        // Sabhi clients ko updated device list bhejo
        broadcastDeviceList();
      }

      // Agar data message hai
      if (data.type === 'data') {
        console.log(`Data from ${deviceID}: ${data.payload}`);
        // Specific device ke data ko website ya dusre clients ko bhejo
        broadcastData(deviceID, data.payload);
      }
    } catch (err) {
      console.log(`Error parsing message: ${err}`);
    }
  });

  ws.on('close', () => {
    if (deviceID) {
      devices.delete(deviceID); // Device ko Map se hatao
      console.log(`Device disconnected: ${deviceID}`);
      broadcastDeviceList(); // Updated list bhejo
    }
  });
});

// Connected devices ki list broadcast karo
function broadcastDeviceList() {
  const deviceList = Array.from(devices.keys());
  const message = JSON.stringify({ type: 'deviceList', devices: deviceList });
  server.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

// Device data broadcast karo
function broadcastData(deviceID, payload) {
  const message = JSON.stringify({ type: 'data', deviceID, payload });
  server.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

console.log(`Server running on port ${port}`);