var five = require('johnny-five');
var moment = require('moment');
var chalk = require('chalk');

var board = new five.Board({
  port: "COM4"
});

var state = {
	"pump": {
		"running": false,
    "duration": 10000
	}
};

function getNow() {
  return moment().format('h:mm:ss');
}

function runPump() {
  state.pump.running = true;
  console.log(chalk.cyan(getNow(), "pump is initialized"));
	setTimeout(() =>{
		stopPump();
	}, state.pump.duration)
}

function stopPump() {
  state.pump.running = false;
	console.log(chalk.red(getNow(), "pump is stopped"));
}

function loop() {
  setTimeout(() => {
    if (state.pump.running === true) {
      console.log(chalk.cyan(getNow(), "Pumping water"));
    } else {
      console.log(chalk.green(getNow(), "System is working"));
    }
    if (getNow() === "11:49:00") {
      runPump();
    }
    loop();
  }, 1000)
}

board.on("ready", () => {
  loop();
});
