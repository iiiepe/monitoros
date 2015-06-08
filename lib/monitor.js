var monitor = require("os-monitor");
var Dashi = require("./dashi");
var df = require("freediskspace");
var os = require("os");

function main(options) {
	var dashi = new Dashi(options);
	
	var totalRAM = Number(os.totalmem());
	var freeRAM = Number(os.freemem());
	var usedRAM = totalRAM-freeRAM;
	var usedPercentage = Math.round((usedRAM*100)/totalRAM);
	var dangerLimit = 100-options.ram.dangerLimit; // this is a percentage

	// transform to bytes the percentage
	var dangerRAMLimit = ((dangerLimit*totalRAM)/100); // bytes

	monitor.start({ 
		freemem: dangerRAMLimit,
		delay: options.delay*100 // interval in ms between monitor cycles 
	});

	monitor.on('freemem', function(event) {
		if(options.messages) {
			if(options.messages.uri) {
			  var freeMemory = Math.round(os.freemem()/1024/1024);
			  var date = new Date();
			  var year = date.getFullYear();
			  var month = date.getMonth();
			  var day = date.getDate();
			  var time = date.getHours() + ":" + date.getMinutes() 
			  var now = time + " " + day + "/" + month + "/" + year;
			  var title = os.hostname() + " memory warning";
			  var content = os.hostname() + " is going to crash, it has a free memory of " + freeMemory + " MB, last reported at " + now;
			  var image = options.messages.image;
			  var link = options.messages.link ? options.messages.link : "";

			  // send the message
			  dashi.message(title, content, image, link);
			}
		}
	}, monitor.seconds(options.delay));

	monitor.throttle("monitor", function(event) {
		if(options.ram) {
			if(options.ram.dangerLimit && options.ram.uri) {
				dashi.RAM(event);
			}
		}

		if(options.cpu) {
			if(options.cpu.uri) {
				dashi.CPU(event);
			}
		}

		if(options.disk) {
			if(options.disk.fileSystem && options.disk.uri) {
				df.detail(options.disk.fileSystem, function(err, details) {
					dashi.diskSpace(details);
				});
			}
		}

	}, monitor.seconds(options.delay));

	monitor.start({stream: true});
}

module.exports = main;
