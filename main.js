var irc = require('irc');

var config = require('./config.json');

var client = new irc.Client(config.server, config.nick, config.options);

client.addListener('message', function (from, to, message) {
    console.log(from + ' => ' + to + ': ' + message);
});

client.addListener('error', function(message) {
    console.log('error: ', message);
});
