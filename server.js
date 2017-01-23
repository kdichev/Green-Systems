const express = require('express');
const app = express();
const server = require('http').createServer(app);
var io = require('socket.io')(server);
var PumpController = require('./PumpController.js');

app.get('/', (req, res, next) => {
  res.sendFile(__dirname + '/index.html')
});

var array = [];

app.get('/pump', (req, res, next) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify({ a: 1 }));
});

const port = process.env.PORT || 1337;

server.listen(port);
console.log(`Local server listening on http://localhost:${port}`);
console.log(`Live server listening on 93.167.121.188:${port}`);


PumpController.init((relay) =>{
  io.on('connection', function (socket) {
    socket.emit('initialized', false);
    socket.on('toggle', function (data) {
      console.log(data);
      relay.toggle();
    });
  });
});
