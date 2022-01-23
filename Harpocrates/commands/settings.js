exports.run = (client, message, args) => {
  const tab = "\u200B \u200B \u200B \u200B";
  const point = "<:small_blue_diamond:934695177304567838>"

  const settings =
    `${tab}${point}scamAlert: Toggle updates from the FTC about new scams.\n`
    + `${tab}${point}linkValidation: Toggle whether suspicious links will be censored.\n`
    + `${tab}${point}privateInfoFilter: Toggle whether users will be warned when they try to share potentially private information.\n`
    + `${tab}${point}dailyTips: Toggle whether daily cyber security tips will be displayed.\n`;

  const embed = {
    "title": "**Bot Settings <:gear:934855241206214766>**",
    "description": "\nUse with: -[on|off] [setting you want to toggle on/off]",
    "color": "808080",
    "fields": [{
      "name": "**Settings**",
      "value": settings,
    }
    ]
  };

  message.channel.send({
    embed
  });
};