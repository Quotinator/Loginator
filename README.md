# Loginator
Loginator was built to capture IRC messages for [Quotinator](https://github.com/Quotinator/Quotinator).

# Dependencies
* NodeJS
* MongoDB
* NPM

# Install
```bash
$ git clone https://github.com/Quotinator/Loginator.git
$ npm install
$ cp config.json.sample config.json
$ forever start main.js
```

# Configuration
Loginator is packaged with a sample config: [config.json.sample](config.json.sample)
## Database
* `connectionString` - We use a standard MongoDB connection string. For more info, visit MongoDB's website on the topic: [Connection String URI Format](http://docs.mongodb.org/manual/reference/connection-string/)
* `chat` - This is the collection where chat logs are stored. Default value is `chat`.
* `channels` - This is the collection where persistant channels are stored. Default value is `channels`.
* `retention` - This is how long messages will be logged in the `chat` collection. Default value is `1800` seconds. Remove this field from the config will make Loginator retain messages forever.
## IRC Client
* `server` - Your IRC servers hostname or IP.
* `nick` - What you want to call Loginator.
* `options` - There are more options than listed below. This list is just passed to Node IRC. For a full list visit: [Node-IRC API](https://node-irc.readthedocs.org/en/latest/API.html#events)
  * `channels` - Default channels that Loginator will always connect to. Persistant channels defined from within IRC are appended to this at startup.
  * `port` - IRC server port.
  * `stripColors` - Strips colors from messages.

# Commands
* `/invite Loginator` - Loginator will accept IRC invitations and join the requested channel.
* `persist #channel` - Joins the channel and make it persistent across reboots.
* `persistent channels` - Lists all channels that are persistent.

# Contributing
I'm open for suggestions. Submit an issue or make a pull request. I don't bite :)

*much*
