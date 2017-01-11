var five = require('johnny-five');
var moment = require('moment');
var chalk = require('chalk');

var board = new five.Board({
  port: "COM4"
});

var state = {
 "pump": {
  "running": false,
     // duration of pumping
     "duration": 10000,
     // when to water
     "wateringTimes": [moment().add(10, "s").format('HH:mm:ss'), moment().add(30, "s").format('HH:mm:ss')]
 },
   "system": {
     // tick for loop
     "tick": 1000,
     "counter": 0,
     "days": 0,
     "startTime": null
  }
};

function getStats() {
 var now = moment().add(24, 'hours');
 process.stdout.write('\033c');
   console.log("Watering times: ", state.pump.wateringTimes[0], state.pump.wateringTimes[1], state.pump.wateringTimes[2]);
   console.log("Duration of watering: ", state.pump.duration / 1000, "seconds");
   console.log("%------------------------------------------%")
 console.log("System has been running for", now.diff(state.system.startTime, 'days'), "Since :", state.system.startTime);
   console.log("has run", state.system.counter , "times today");
 if(state.pump.running != true) {
   console.log(chalk.bgRed(getTime(), "Pump is stopped"));
 } else {
      console.log(chalk.bgCyan(getTime(), "Pumping water"));
 }
    console.log(chalk.green(getTime(), "System is working"));
};

// return now in format (12:00:00)
function getTime() {
  return moment().format('HH:mm:ss');
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
}

function runPump() {
  state.pump.running = true;
  state.system.counter++;
  // relay.on();
 setTimeout(() =>{
  stopPump();
 }, state.pump.duration);
};

function stopPump() {
  state.pump.running = false;
  // relay.off();
};

function loop() {
  getStats();
  setTimeout(() => {
    if (shouldPump()) {
      runPump();
    }
    loop();
  }, state.system.tick);
};

board.on("ready", () => {
  // var relay = new five.Relay(10);
  state.system.startTime = moment();
  loop();
  // this.repl.inject({
  //   relay: relay
  // });
});
