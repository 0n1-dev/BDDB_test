const gs = require('../models/gSetting');

module.exports = client => {
    client.getGuild = async guild => {
        let data = await gs.findOne({ guild_id: guild.id });
        if(data) return data;
        else return null;
    };

    client.setGuild = async guild => {
        let data = new gs();
        data.guild_id = guild.id;
        data.save((err, result) => {
            if(err) return false;
            return true;
        });
    }
}