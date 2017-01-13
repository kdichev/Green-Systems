var five = require('johnny-five');
var moment = require('moment');
var chalk = require('chalk');

var board = new five.Board({
  port: "COM3"
});

var state = {
 "pump": {
  "running": false,
     // duration of pumping
     "duration": 5000,
     // when to water
     "wateringTimes": [moment().add(10, "s").format('HH:mm:ss'), moment().add(30, "s").format('HH:mm:ss'), moment().add(50, "s").format('HH:mm:ss'), moment().add(70, "s").format('HH:mm:ss')]
 },
   "system": {
     // tick for loop
     "tick": 1000,
     "counter": 0,
     "days": 0,
     "startTime": null
  }
};


board.on("ready", () => {
  var relay = new five.Relay(13);
  relay.close();
  board.loop(state.system.tick, function() {
    loop(relay);
  });
});


function loop(relay) {
  if (shouldPump()) {
    runPump(relay);
  }
};

function runPump(relay) {
  console.log("pump is running");
  relay.open();
  setTimeout(() =>{
   stopPump(relay);
  }, state.pump.duration);
};

function stopPump(relay) {
  console.log("pump is stopped");
  relay.close();
};

function shouldPump() {
  var now = getTime();
  var wateringTimesLocal = state.pump.wateringTimes;
  for(var i = 0; i < wateringTimesLocal.length; i++) {
    if(wateringTimesLocal[i] === now) {
      return true;
    }
  }
  return false;
};

function getTime() {
  return moment().format('HH:mm:ss');
};
