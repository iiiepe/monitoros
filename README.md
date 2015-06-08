# Monitor OS
A program to monitor the operating system written in Node.js. Works with [Dashi3](https://github.com/iiiepe/dashi3)

## Install

		npm install -g monitoros

## Usage

Configure the JSON file, name it whatever you want and move it to a location. Use the included options.json as a guide to write your own.

Run with:
		
		monitoros -c /path/to/options.json

You can create an upstart job to load on boot

### Options

		{
			"disk": {
				"fileSystem": "/dev/disk0s2",
				"uri": "http://dashi.mywebsite.net/api/v1/data/mac-hard-drive"
			},
			"ram": {
				"dangerLimit": "80",
				"uri": "http://dashi.mywebsite.net/api/v1/data/mac-memory"
			},
			"cpu": {
				"uri": "http://dashi.mywebsite.net/api/v1/data/mac-cpu"
			},
			"messages": {
				"uri": "http://dashi.mywebsite.net/api/v1/data/messages"
			},
			"access_token": "yfERm7mXNdRPV93am4a22ir9PcxHmExq5JW0H6gLez99o0pL5RRBX1pXwMp0X4Ai",
			"delay": 60
		}

_*.uri_: Path to where you want to save the data on Dashi3

_disk.fileSystem_: The disk to monitor, currently, only one disk can be monitored

_ram.dangerLimit_: The CPU percentage of used memory when an alert will be triggered (don't include the % sign). The alert will be of type messages.

_access_token_: The access token in Dashi3

_delay_: How often you want to run the program in seconds

# Install

		wget -qO- https://raw.githubusercontent.com/iiiepe/monitoros/master/monitoros/setup | sudo sh