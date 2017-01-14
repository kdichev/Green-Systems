var five = require('johnny-five');
var moment = require('moment');
var events = require('events');
var eventEmitter = new events.EventEmitter();

var board = new five.Board({
  port: "COM4",
  repl: false,
});

var state = {
 "pump": {
   "running": false,
   // duration of pumping
   "duration": 5000,
   "counter": 0,
   // when to water
   "wateringTimes": [moment().add(10, "s").format('HH:mm:ss'), moment().add(30, "s").format('HH:mm:ss'), moment().add(50, "s").format('HH:mm:ss'), moment().add(70, "s").format('HH:mm:ss')]
   //"wateringTimes": ["08:00:00", "12:00:00", "16:00:00", "18:00:00", "22:43:00"]
 },
   "system": {
     // tick for loop
     "tick": 1000,
     "dateFormat": "HH:mm:ss"
  }
};

var pumpListenerOn = () => {
   console.log('Pump is on');
};

var pumpListenerOff = () => {
   console.log('Pump is off');
};

var appListenerExit = () => {
   console.log("Exiting");
};

var appListenerReady = () => {
  console.log("Initialized");
};

eventEmitter.addListener('pumpOn', pumpListenerOn);
eventEmitter.addListener('pumpOff', pumpListenerOff);
eventEmitter.addListener('exit', appListenerExit);
eventEmitter.addListener('init', appListenerReady);

board.on("ready", () => {
  eventEmitter.emit('init');
  var relay = new five.Relay(13);
  relay.close();
  board.loop(state.system.tick, function() {
    loop(relay);
  });
});

// on app close
board.on("exit", () => {
  eventEmitter.emit('exit');
  var relay = new five.Relay(13);
  relay.close();
});

board.on("connect", function() {
  console.log("Connected");
});

function loop(relay) {
  if (shouldPumpRun()) {
    runPump(relay);
  }
  if (state.pump.running) {
    shouldPumpStop(relay);
  }
};

function runPump(relay) {
  eventEmitter.emit('pumpOn');
  state.pump.running = true;
  relay.open();
};

function stopPump(relay) {
  eventEmitter.emit('pumpOff');
  state.pump.running = false;
  state.pump.counter = 0;
  relay.close();
};

function shouldPumpRun() {
  var now = getTime();
  var wateringTimesLocal = state.pump.wateringTimes;
  for(var i = 0; i < wateringTimesLocal.length; i++) {
    if(wateringTimesLocal[i] === now) {
      return true;
    }
  }
  return false;
};

function shouldPumpStop(relay) {
  state.pump.counter++;
  pumpCounterToMilliseconds = state.pump.counter * 1000;
  if (pumpCounterToMilliseconds === state.pump.duration) {
    stopPump(relay);
  }
};

function getTime() {
  return moment().format(state.system.dateFormat);
};
