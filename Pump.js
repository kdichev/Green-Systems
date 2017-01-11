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
    "duration": 10000
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

function runPump() {
  state.pump.running = true;
  console.log(chalk.cyan(getNow(), "pump is initialized"));
  // relay.on();
	setTimeout(() =>{
		stopPump();
	}, state.pump.duration);
};

function stopPump() {
  state.pump.running = false;
	console.log(chalk.red(getNow(), "pump is stopped"));
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
    if (getNow() === "09:13:00" || getNow() === "09:13:30" || getNow() === "09:14:00") {
      runPump();
    }
    loop();
  }, state.system.tick);
};

board.on("ready", () => {
  // var relay = new five.Relay(10);
  loop();

  // this.repl.inject({
  //   relay: relay
  // });
});
