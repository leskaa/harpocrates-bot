exports.run = (client, message, args) => {
const tab = "\u200B \u200B \u200B \u200B";
const point = "<:small_blue_diamond:934695177304567838>"

  const response =
    `${tab}${point}**-help**: Shows the list of commands or help on specified command.\n`
    + `${tab}${point}**-ping**: Checks connectivity with discord\'s servers.\n`
    + `${tab}${point}**-settings**: Enable or Disable various features of Harpocrates.\n`
    + `${tab}${point}**-tips**: Data privacy and security tips.\n`
    + `${tab}${point}**-resources**: Data privacy and cybersecuirty resources.\n`
    + `${tab}${point}**-recentScam**: Reports most recent scam.\n`;

  const embed = {
    "title": "**HELP COMMAND <:information_source:934903884630065172>**",
    "description": "This command displays all of your available commands.",
    "color": "808080",
    "fields": [{
      "name": "**Command List**",
      "value": response,
    }
    ]
  };

  message.channel.send({
    embed
  });
}