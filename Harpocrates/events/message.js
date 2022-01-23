const config = require('../config');

exports.run = async(bot, message) => {

  // Command Call (Do not touch)
  if (message.content.startsWith(config.prefix)) {
    
  let messageArray = message.content.split(" "),
      cmd = messageArray[0],
      args = messageArray.slice(1),
      commandfile = bot.commands.get(cmd.slice(config.prefix.length));

  if(!commandfile) return;   
  commandfile.run(bot,message,args);             
  }
}