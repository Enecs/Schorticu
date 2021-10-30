const {MessageEmbed} = require("discord.js");
const Yourls = require('yourls');
const { yourlsToken, yourlsURL } = require('../config.json')

module.exports.run = async (client, message, args) => {
    if(args.length == 0) {
        const e = new MessageEmbed()
            .setTitle('Missing Arguments')
            .setDescription('Please provide a link after the command.')
            .setColor('RED')
            .setTimestamp()
        return message.channel.send(e);
    }
    
  var yourls = new Yourls(yourlsURL, yourlsToken);
  yourls.shorten(args[0], function(error, result) {
    if(result.status == 'fail'){
        const e = new MessageEmbed()
          .setTitle('Shorten Error')
          .setColor('RED')
          .setDescription('An error occured while our services were processing your request.')
          .addField('Error', `${result.message}`)
          .setFooter(message.author.username, message.author.avatarURL)
          .setTimestamp();
        return message.channel.send(e);
    }
    const e = new MessageEmbed()
        .setTitle('Shorten Success')
        .setColor('GREEN')
        .setDescription('Thank you for using this bot')
        .addField('Short URL', `[click here](${result.shorturl})`)
        .setFooter(message.author.username, message.author.avatarURL)
        .setTimestamp();
    return message.channel.send(e);
  })
};

module.exports.config = {
    name: "short",
    aliases: ['schort', 'cuturl'],
    description: "Shorten Links",
    type: "user"
};
