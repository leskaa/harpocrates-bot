exports.run = (client, message, args) => {
  const embed = {
    "title": "**PING COMMAND <:ping_pong:934904147612950569>**",
    "description": "This command pings the bot and returns the status of the bot.",
    "color": "808080",
    "footer": {
    "fields": [{
        "name": "Ping Status:",
        "value": "Recieved",
      }]
    }
  };
  message.channel.send({
    embed
  });
};
