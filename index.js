const Eris = require('eris');
const Promise = require('bluebird');
const path = require('path');
const fs = Promise.promisifyAll(require("fs"));
const config = require(path.resolve("config.json"));

global.mongoose = require("mongoose");

async function init(){
    mongoose.connect('mongodb://13.124.131.111:27017/guilds',{ useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });

    if(!config.discord.token) {
        console.error("No token found in config.json");
        process.exit(0);
    } else if(!config.discord.prefix) {
        console.error("No prefix(es) found in config.json");
        process.exit(0);
    }

    const client = new Eris(config.discord.token, {
        getAllUsers: true,
        prefix: config.discord.prefix
    });
    require('./utils/dbFunction')(client);

    fs.readdir('./listeners/', (err, files) => {
        if(err) return console.log(err);
        files.forEach(file => {
            if(!file.endsWith('.js')) return;
            const evt = require(`./listeners/${file}`);
            let evtName = file.split('.')[0];
            console.log(`Load ${evtName}`);
            client.on(evtName, evt.bind(null, client));
        })
    });

    client.on("ready", () => {
        client.editStatus("online", { name: `${client.guilds.size} servers | .help`, type: 3 });
    });

    client.connect();
}

init();