const {Discord: Discord, MessageEmbed} = require("discord.js");
const {inspect} = require("util");

module.exports.run = async (client, message, args) => {
    const { member, author, channel, guild } = message;
    
    const embed = new MessageEmbed()
      .setFooter(message.author.username, message.author.avatarURL())
    const query = args.join(' ')
    if (query) {
      const code = (lang, code) => (`\`\`\`${lang}\n${String(code).slice(0, 1000) + (code.length >= 1000 ? '...' : '')}\n\`\`\``).replace(client.token, '*'.repeat(client.token.length))
      try {
        const evald = eval(query)
        const res = (typeof evald === 'string' ? evald : inspect(evald, { depth: 0 }))
        embed.addField('Result', code('js', res))
          .addField('Type', code('css', typeof evald === 'undefined' ? 'Unknown' : typeof evald))
          .setColor('#8fff8d')
      } catch (err) {
        embed.addField('Error', code('js', err))
          .setColor('#ff5d5d')
      } finally {
        message.channel.send(embed).catch(err => {
            message.channel.send(`There was an error while displaying the eval result! ${err.message}`)
          })
      }
    } else {
      message.channel.send('Please, write something so I can evaluate!')
    }
};

module.exports.config = {
    name: "eval",
    aliases: ['ev'],
    description: "Evaluates arbitrary Javascript",
    type: "superadmin"
};