var five = require('johnny-five');
var board = new five.Board();

board.on("ready", () => {
var relay = new five.Relay(9);

  // Control the relay in real time
  // from the REPL by typing commands, eg.
  //

  relay.on();
  
  setTimeout(() => {
	  relay.off();

	}, 3000)
})