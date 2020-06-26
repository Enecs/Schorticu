const { Client, Collection, MessageEmbed } = require('discord.js');
const client = new Client();
const config = require('./config.json');
const fs = require('fs');
client.commands = new Collection();
client.aliases = new Collection();
client.cooldown = new Collection();

// Reads all commands and boots them in
fs.readdir('./commands/', (err, files) => {
  if (err) console.log(err);
  let jsfile = files.filter(f => f.split(".").pop() === 'js')
  if (jsfile.length <= 0) {
    console.log('Couldn\'t find commands.');
    return
  }

  jsfile.forEach((files, i) => {
    let props = require(`./commands/${files}`);
    console.log(`${files} has been loaded.`);
    client.commands.set(props.config.name, props);
    props.config.aliases.forEach(alias => { client.aliases.set(alias, props.config.name); });
  })
});

client.on('ready', () => {
  let serversword = (client.guilds.cache.size > 1) ? 'servers' : 'server';
  let usersword = (client.users.cache.size > 1) ? 'users' : 'user';

  console.log(`${client.user.username} is online and is operating on ${client.guilds.cache.size} ${serversword} for ${client.users.cache.size} ${usersword}.`);

  function setActivity() {
    client.user.setActivity(`you shorten links. | s!help | Made by DanPlayz#1486`, {type: "WATCHING"});
  };

  setActivity();
  setInterval(setActivity, 120000);
});

client.on('message', message => {
  if (message.author.bot) return;
  if (message.channel.type === 'dm') return;
  if (message.guild && !message.channel.permissionsFor(message.guild.me).missing("SEND_MESSAGES")) return;

  let prefix = config.prefix;
  let messageArray = message.content.split(" ");
  let cmd = messageArray[0];
  let args = messageArray.slice(1);

  if (!cmd.startsWith(prefix)) return;
  const cooldown = client.cooldown.get(message.guild.id) || 0;
  let dnow = Math.round(new Date().getTime() / 1000);
  
  if(dnow <= (parseInt(cooldown) + 2)){
    let e = new MessageEmbed()
      .setColor('RED')
      .setTitle(`Server-wide cooldown in effect!`)
      .setDescription(`${message.member}, You need to wait ${dnow-parseInt(cooldown)} seconds before **anyone** can use this!`)
    return message.channel.send(e);
  }
  let commandfile = client.commands.get(cmd.slice(prefix.length)) || client.commands.get(client.aliases.get(cmd.slice(prefix.length)));
  if (commandfile) {
      if(commandfile.config.type == "superadmin") {
          if(config.sadmins.includes(message.author.id)) {
              return commandfile.run(client,message,args);
          } else {
              return message.channel.send('you do not have perms to do this.')
          }
      } else {
        return commandfile.run(client,message,args);
      }
  }
});

// Everyone Announce \\ 
client.on("message", message => {
  if (!message) return;
  if (message.channel.id != 717423903995068476) return;
  let e = new MessageEmbed()
      .setAuthor(message.member.displayName, message.author.avatarURL())
      .setDescription(message.content)
      .setColor("YELLOW")
      .setFooter("Schort.Icu - Announcements");
  message.guild.channels.cache.get("707980545019347000").send(e);
  message.guild.channels.cache.get("707980545019347000").send("||@everyone||");
});

// Priority 1 Announce \\ 
client.on("message", message => {
  if (!message) return;
  if (message.channel.id != 717423014165086280) return;
  message.guild.roles.cache.get("707981447235108916").setMentionable(true);
  message.guild.channels.cache.get("707980545019347000").send("<@&707981447235108916>");
  message.guild.roles.cache.get("707981447235108916").setMentionable(false);
  let e = new MessageEmbed()
      .setAuthor(message.member.displayName, message.author.avatarURL())
      .setDescription(message.content)
      .setColor("RED")
      .setFooter("Schort.Icu - Announcements");
  message.guild.channels.cache.get("707980545019347000").send(e);
});

// Priority 2 Announce \\ 
client.on("message", message => {
  if (!message) return;
  if (message.channel.id != 717423038572003398) return;
  message.guild.roles.cache.get("707981378599256166").setMentionable(true);
  message.guild.channels.cache.get("707980545019347000").send("<@&707981378599256166>");
  message.guild.roles.cache.get("707981378599256166").setMentionable(false);
  let e = new MessageEmbed()
      .setAuthor(message.member.displayName, message.author.avatarURL())
      .setDescription(message.content)
      .setColor("ORANGE")
      .setFooter("Schort.Icu - Announcements");
  message.guild.channels.cache.get("707980545019347000").send(e);
});

// Priority 3 Announce \\ 
client.on("message", message => {
  if (!message) return;
  if (message.channel.id != 717423054422278145) return;
  message.guild.roles.cache.get("707981326787281027").setMentionable(true);
  message.guild.channels.cache.get("707980545019347000").send("<@&707981326787281027>");
  message.guild.roles.cache.get("707981326787281027").setMentionable(false);
  let e = new MessageEmbed()
      .setAuthor(message.member.displayName, message.author.avatarURL())
      .setDescription(message.content)
      .setColor("YELLOW")
      .setFooter("Schort.Icu - Announcements");
  message.guild.channels.cache.get("707980545019347000").send(e);
});

client.on('messageUpdate', (oldMessage, newMessage) => {
   if(oldMessage == newMessage || oldMessage.content == newMessage.content) return;
   client.emit('message', newMessage); 
});

client.on('guildCreate', guild => {
  
    // TOP.GG GUILD POST
    const DBL = require('dblapi.js');
    const dbl = new DBL(config.dblToken)
    dbl.postStats(client.guilds.cache.size);

    // Log guild join
    const e = new MessageEmbed()
      .setTitle(`JOINED \`${guild.name}\``)
      .setColor('#36393E')
      .setDescription(`Members: ${guild.members.cache.size}\nID: ${guild.id}\nOwner: ${guild.owner.user.username} (${guild.owner.user.id})`);
    client.channels.cache.get('722637589860843620').send(e);
    console.log(`[GUILD JOIN] ${guild.name} (${guild.id}) added the bot. Owner: ${guild.owner.user.tag} (${guild.owner.user.id})`);
});

client.on('guildDelete', guild => {
    if(!guild.available) return;

    // Log it.
    const e = new MessageEmbed()
      .setTitle(`LEFT \`${guild.name}\``)
      .setColor('#36393E')
      .setDescription(`Members: ${guild.members.cache.size}\nID: ${guild.id}\nOwner: ${guild.owner.user.username} (${guild.owner.user.id})`);
    client.channels.cache.get('722637589860843620').send(e);
    console.log(`[GUILD LEAVE] ${guild.name} (${guild.id}) removed the bot.`);
});

client.login(config.token);