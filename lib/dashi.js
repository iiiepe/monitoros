var request = require("request");
var events = require("events");

function Dashi(options) {
	this.access_token = options.access_token;
	this.options = options;
	events.EventEmitter.call(this);
}

Dashi.prototype.__proto__ = events.EventEmitter.prototype;

Dashi.prototype.send = function(uri, data, done) {
	var self = this;
	request.post({
		method: "POST",
		uri: uri + "?access_token=" + self.access_token,
		json: data,
	}, function(err, response, body) {
		if(err) console.log(err);
		return done(err, body);
	});
}

Dashi.prototype.RAM = function(event) {
	var self = this;

	var totalRAM = Number(event.totalmem);
	var freeRAM = Number(event.freemem);
	var usedRAM = totalRAM-freeRAM;

	// reports % of used memory
	var data = {
		value: Math.round((usedRAM*100)/totalRAM)
	}

	this.send(self.options.ram.uri, data, function(err, result) {
		self.emit("ram:sent");
	});
}

/**
 * Sends the amount of used diskSpace
 * @param  {object} event The event object
 * @return {event}       Emits an event
 */
Dashi.prototype.diskSpace = function(event) {
	var self = this;

	var totalDiskSpace = Number(event.total);
	var freeDiskSpace = Number(event.free);
	var usedDiskSpace = totalDiskSpace-freeDiskSpace;

	var data = {
		value: Math.round((usedDiskSpace*100)/totalDiskSpace)
	}

	this.send(self.options.disk.uri, data, function(err, result) {
		self.emit("diskSpace:sent");
	})
}

Dashi.prototype.message = function(title, content, image, link) {
	var self = this;
	var data = {
		title: title,
		content: content,
		image: image,
		link: link	
	}	

	this.send(self.options.messages.uri, data, function(err, result) {
		self.emit("message:sent");
	})
}

Dashi.prototype.CPU = function(event) {
	var self = this;
	var load = event.loadavg;
	var sum = 0;
	for( var i = 0; i < load.length; i++ ){
	  sum += load[i];
	}

	var avg = sum/load.length;

	var data = {
		value: avg
	}

	this.send(self.options.cpu.uri, data, function(err, result) {
		self.emit("cpu:sent");
	});

}

module.exports = Dashi;