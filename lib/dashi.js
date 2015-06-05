var request = require("request");
var events = require("events");

function Dashi(uri) {
	this.url = uri;
	events.EventEmitter.call(this);
}

Dashi.prototype.__proto__ = events.EventEmitter.prototype;

Dashi.prototype.send = function(data, widgetId, done) {
	var url = this.url + "/api/v1/data/" + widgetId + "/data";

	request.post({
		method: "POST",
		uri: url,
		json: data,
	}, function(err, response, body) {
		if(err) console.log(err);
		return done(err, body);
	});

}

Dashi.prototype.freeRAM = function(event, widgetId) {
	var self = this;
	var data = {
		value: Math.round((Number(event.freemem)*100)/Number(event.totalmem))
	}

	this.send(data, widgetId, function(err, result) {
		self.emit("freeRAM:sent");
	});
}

Dashi.prototype.freeDiskSpace = function(event, widgetId) {
	var self = this;
	var data = {
		value: Math.round((Number(event.free)*100)/Number(event.total))
	}

	this.send(data, widgetId, function(err, result) {
		self.emit("freeDiskSpace:sent");
	})
}

Dashi.prototype.message = function(widgetId, title, content, image, link) {
	var self = this;
	var data = {
		value: {
			title: title,
			content: content,
			image: image,
			link: link
		}
	}	

	this.send(data, widgetId, function(err, result) {
		console.log(err);
		self.emit("message:sent");
	})
}

module.exports = Dashi;