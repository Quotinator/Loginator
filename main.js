var irc = require('irc');
var mongojs = require('mongojs');
var config = require('./config.json');

var db = mongojs(config.db.connectionString);
var chat = db.collection(config.db.chat);
var channels = db.collection(config.db.channels);

//Drop documents older than our set retention time (If defined)
if (typeof config.db.retention !== 'undefined') {
	chat.ensureIndex({ "Date": 1 }, { expireAfterSeconds: config.db.retention });
}

//Append channels from database
channels.find().forEach(function(err, doc) {
    if (!doc) {
        return;
    }
    config.irc.options.channels.push(doc.channel);
});

//Create IRC Client
var client = new irc.Client(config.irc.server, config.irc.nick, config.irc.options);

/** Functions **/
var logSave = function(hash) {
    hash.Date = new Date;
    chat.save(hash, {w: 0});
}

var channelPersist = function(channel, nick) {
    client.join(channel);
    channels.save({channel: channel, nick: nick});
}

/** Listeners **/

//Channel listener
client.addListener('message#', function (nick, channel, message) {
    logSave({channel: channel, type: 'message', nick: nick, message: message});
});

//We are listening for commands here
client.addListener('message', function (nick, channel, message) {
    msg = message.split(" ");
    if (msg[0] === "persist") {
        channelPersist(msg[1], nick);
    }
    if (message === "persistent channels") {
        client.say(channel, config.irc.options.channels);
    }
});

client.addListener('join', function (channel, nick, message) {
    logSave({channel: channel, type: 'join', nick: nick});
});

client.addListener('part', function (channel, nick, reason, message) {
    logSave({channel: channel, type: 'part', nick: nick, reason: reason});
});

client.addListener('quit', function (nick, reason, channels, message) {
    logSave({type: 'quit', nick: nick, reason: reason});
});

client.addListener('invite', function (channel, from, message) {
    client.join(channel);
});

client.addListener('action', function (from, to, message) {
    logSave({channel: to, type: 'action', nick: from, message: message});
});

client.addListener('error', function(message) {
    console.log('error: ', message);
});
