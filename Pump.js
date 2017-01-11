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
    "duration": 10000,
    // when to water
    "wateringTimes": ["08:00:00", "12:00:00", "16:00:00", "20:00:00", "24:00:00", moment().add(10, "s").format('HH:mm:ss'), moment().add(20, "s").format('HH:mm:ss'), moment().add(30, "s").format('HH:mm:ss')]
	},
  "system": {
    // tick for loop
    "tick": 1000
  }
};

// return now in format (12:00:00)
function getNow() {
  return moment().format('HH:mm:ss');
};

function shouldPump() {
  var now = getNow();
  var wateringTimesLocal = state.pump.wateringTimes;
  for(var i = 0; i<wateringTimesLocal.length; i++) {
    if(wateringTimesLocal[i] == now) {
      return true;
    }
  }
  return false;
}

function runPump() {
  state.pump.running = true;
  console.log(chalk.inverse(getNow(), "Pump is starting"));
  // relay.on();
	setTimeout(() =>{
		stopPump();
	}, state.pump.duration);
};

function stopPump() {
  state.pump.running = false;
	console.log(chalk.bgRed(getNow(), "Pump is stopped"));
  // relay.off();
};

function loop() {
  setTimeout(() => {
    // check state of loop
    if (state.pump.running === true) {
      console.log(chalk.cyan(getNow(), "Pumping water"));
    } else {
      console.log(chalk.green(getNow(), "System is working"));
    }
    // check if it is ready to start the pump
    if (shouldPump()) {
      runPump();
    }
    loop();
  }, state.system.tick);
};

board.on("ready", () => {-
  console.log("Watering times: ", state.pump.wateringTimes[0], state.pump.wateringTimes[1], state.pump.wateringTimes[2]);
  console.log("Duration of watering: ", state.pump.duration / 1000, "seconds");
  // var relay = new five.Relay(10);
  loop();
  // this.repl.inject({
  //   relay: relay
  // });
});
