const {Discord: Discord, MessageEmbed} = require("discord.js");
const moment = require("moment");

module.exports.run = async (client, message, args) => {
    let cmds = client.commands;
    let userCmds = cmds.filter(c => c.config.type === "user");
    let devCommands = cmds.filter(c => c.config.type === "superadmin");

    if (!args[0]) {
        let embed = new MessageEmbed()
            .setTitle(`Current Commands ${cmds.size}`)
            .setColor("ORANGE")
            .addField("Commands (" + userCmds.size + ")", userCmds.keyArray().join(`\n`), true)
            .addField("SuperAdmin (" + devCommands.size + ")", devCommands.keyArray().join(`\n`), true);
        return message.channel.send(embed);
    }
    let command = client.commands.get(args[0].toLowerCase()) || client.commands.get(client.aliases.get(args[0].toLowerCase()));
    if (!command) {
        const e = new MessageEmbed()
            .setTitle("Invalid Arguments")
            .setDescription("This command doesn't exist.")
            .setColor("RED")
        return message.channel.send(e);
    }
    let commandName = command.config.name;
    let commandType = command.config.type;
    let commandDesc = command.config.description;
    let commandAliases = command.config.aliases;
    let commandEmbed = new MessageEmbed()
        .setColor("ORANGE")
        .setTitle(`Info: \`${commandName}\``)
        .addField("Command Group", `${commandType}`)
        .addField("Command Description", commandDesc)
        .addField("Aliases", commandAliases.map(a => `\`${a}\``).join(", ") || "None");
    return message.channel.send(commandEmbed);
};

module.exports.config = {
    name: "help",
    aliases: ["helpme", "cmds"],
    description: "Shows information on all commands for the bot.",
    type: "user"
};