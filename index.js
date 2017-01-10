var five = require('johnny-five');
var board = new five.Board({ port: "COM4" });

var state = {
	"pump": {
		"running": false,
		"period": 120000,
	},
	"system": {
		"period": 2500
	},
	"day": {
		"period": 50000
	}
};

board.on("ready", () => {
loop();
})

var time = 0;
function loop() {
	var date = new Date();
	var dateTime = date.getHours() + ":" + date.getMinutes();
	setTimeout(() => {
	if (state.pump.running) {
		console.log("pump is running");
	} else {
		console.log(dateTime, "system ready");
	}
	time += state.system.period
	if (dateTime === "21:50") {
		runPump();
	state.pump.running = true;
	}
	loop();
	}, state.system.period)
}

function runPump() {
	if (state.pump.running) {
		return false;
	}
	console.log("pump is initialized");
	setTimeout(() =>{
		stopPump();
	}, state.pump.period)
}

function stopPump() {
	state.pump.running = false;
	console.log("pump is stopped");
}
