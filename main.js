var irc = require('irc');
var mongojs = require('mongojs');
var config = require('./config.json');

var db = mongojs(config.db.connectionString);
var collection = db.collection(config.db.collection);

//Drop documents older than our set retention time
collection.ensureIndex({ "createdAt": 1 }, { expireAfterSeconds: config.db.retention })

//Create IRC Client
var client = new irc.Client(config.irc.server, config.irc.nick, config.irc.options);

var logSave = function(hash) {
	hash.createdAt = new Date;
	collection.save(hash, {w: 0});
}

//Listeners
client.addListener('message', function (nick, channel, message) {
    logSave({channel: channel, type: 'message', nick: nick, message: message});
});

client.addListener('join', function (channel, nick, message) {
    logSave({channel: channel, type: 'join', nick: nick});
});

client.addListener('part', function (channel, nick, reason, message) {
    logSave({channel: channel, type: 'part', nick: nick, reason: reason});
});

client.addListener('error', function(message) {
    console.log('error: ', message);
});
