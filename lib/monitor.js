var monitor = require("os-monitor");
var Dashi = require("./dashi");
var df = require("freediskspace");
var os = require("os");



// // define handler that will always fire every cycle 
// monitor.on('monitor', function(event) {
//   console.log(event.type, ' This event always happens on each monitor cycle!');
// });
 
// // define handler for a too high 1-minute load average 
// monitor.on('loadavg1', function(event) {
//   console.log(event.type, ' Load average is exceptionally high!');
// }, monitor.minutes(1));
 
// define handler for a too low free memory 

 
// // define a throttled handler, using Underscore.js's throttle function (http://underscorejs.org/#throttle) 
// monitor.throttle('loadavg5', function(event) {
 
//  	console.log("loadavg5");
//  	console.log(event);
//   // whatever is done here will not happen 
//   // more than once every 5 minutes(300000 ms) 
 
// }, monitor.minutes(1));

// var options = {
// 		freeDiskSpaceWidget: opts.diskSpaceWidget,
// 		fileSystem: opts.filesystem,
// 		ramWidget: opts.memoryWidget
// 	}

function main(url, options) {
	monitor.start({ 
		freemem: options.freememDangerLimit,
		delay: options.delay*100 // interval in ms between monitor cycles 
	});

	monitor.on('freemem', function(event) {
	  var dashi = new Dashi(url);

	  var freeMemory = Math.round(os.freemem()/1024/1024);
	  var widgetId = "55634534f47df30f00bf5a85";
	  var title = os.hostname() + " memory warning";
	  var content = os.hostname() + " is going to crash, it has a free memory of " + freeMemory + " MB";
	  var image = "http://dashboard.iiiepe.net/images/status-danger.png";
	  var link = "http://nagios.iiiepe.net";

	  dashi.message(widgetId, title, content, image, link);

	}, monitor.seconds(options.delay));

	monitor.throttle("monitor", function(event) {
		console.log(event);

		var dashi = new Dashi(url);

		dashi.freeRAM(event, options.ramWidget);
		df.detail(options.fileSystem, function(err, details) {
			dashi.freeDiskSpace(details, options.freeDiskSpaceWidget);
		});

	}, monitor.seconds(options.delay));

	monitor.start({stream: true});
}

module.exports = main;
