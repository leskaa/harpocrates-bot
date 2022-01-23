const config = require("./config");
const cheerio = require("cheerio");
const axios = require("axios");
const cron = require("cron");
const information = require("./information.json");
const Database = require("@replit/database");
require('./server');

const Discord = require("discord.js"),
  bot = new Discord.Client({
    fetchAllMembers: true, // Remove this if the bot is in large guilds.
    presence: {
      status: 'online',
      activity: {
        name: 'your back!',
        type: 'WATCHING'
      }
    }
  }),
  fs = require("fs"),
  http = require("http"),
  express = require("express"),
  app = express();

// Set up db and daily information index
const db = new Database();
db.set('dailyId', 0);

bot.commands = new Discord.Collection();
bot.events = new Discord.Collection();

// Load commands
fs.readdir("./commands/", (err, files) => {
  if (err) return console.log(err);
  files.forEach(file => {
    if (!file.endsWith(".js")) return;
    let props = require(`./commands/${file}`);
    let commandName = file.split(".")[0];
    bot.commands.set(commandName, props);
  });
});

// Load message handler
fs.readdir("./events/", (err, files) => {
  if (err) console.log(err);
  files.forEach(file => {
    let eventFunc = require(`./events/${file}`);
    let eventName = file.split(".")[0];
    bot.on(eventName, (...args) => eventFunc.run(bot, ...args));
  });
});

// Start bot
let guildChannel;
bot.on('ready', () => bot.guilds.cache.array().forEach((guild) => {
  guildChannel = [];
  const guildId = guild.id;
  const generalChannel = guild.channels.cache.array().find(channel => channel.name === "general" && channel.type === "text");
  guild.channels.cache.array().forEach((channel) => {
    if (channel.type === "text" && channel.name.includes("information")) {
      guildChannel.push({"guildId": guildId, "channel": channel});
    }
  })
  if(!guildChannel.find(guild => guild.guildId === guildId)) {
    guildChannel.push({"guildId": guildId, "channel": generalChannel});
  }
}));

// Check for sensitive information
bot.on('message', async message => {

  if (message.guild === null){
    return;
  }

  //Set Default Settings
  try {
    let guildData = await db.get(message.guild.id);
    if (guildData === null) {
      let data = {
        'settings': {
          'scamAlert': 'on',
          'linkValidation': 'on',
          'privateInfoFilter': 'on',
          'dailyTips': 'on'
        }
      };
      await db.set(message.guild.id, data);
    }
  } catch (err) {
    console.log(err);
  }

  let hasPhoneNumber = false;
  let hasSSID = false;
  let hasPassword = false;
  let hasAddress = false;

  //Check for phone number
  if (message.content.match(/(^|[ ])(\+\d{1,2}\s?)?1?\-?\.?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}($|[ ]|[.]|!|[?]|:|-|,)/)
  ) {
    hasPhoneNumber = true;
  }

  //Check for SSID
  if (message.content.match(/(^|[ ])\d{3}-?[ ]?\d{2}-?[ ]?\d{4}($|[ ]|[.]|!|[?]|:|-|,)/)) {
    hasSSID = true;
  }

  //Check for 'password'
  if (message.content.match(/[P|p][A|a][S|s][S|s][W|w][O|o][R|r][D|d]/)) {
    hasPassword = true;
  }

  //Check for address
  try {
    const { data } = await axios.post('https://addressapi.leskaa.repl.co/parse', {
      content: message.content
    });
    if (data.length > 0) {
      hasAddress = true;
    }
  } catch (err) {
    console.log(err);
  }

  if (hasPhoneNumber || hasSSID || hasPassword || hasAddress) {
    try{
      let messageData = await db.get(message.guild.id);
      if (messageData.settings.privateInfoFilter !== 'on') {
        return;
      }

      if (message.content.startsWith('-bypass')) {
        return;
      }

      let authorMsg = await db.get(message.author.id);
      const minutesElapsed = (Date.now() - authorMsg.timestamp) / 60000;
      if (minutesElapsed >= 30){
        await db.delete(message.author.id);
      }
      
      authorMsg = await db.get(message.author.id);
      if (authorMsg != null && authorMsg.message === message.content) {
        await db.delete(message.author.id);
        return;
      }
    } catch (err) {
      console.log(err);
    }
    
    const embed = {
      "title": "**Privacy Warning**",
      "description": `:shushing_face: Harpocrates is worried you might've just shared **sensitive information**. Your message sent in ${message.channel}, ${message.guild} may contain the following sensitive information: **\n${hasPhoneNumber ? '\n - Phone Number :telephone:' : ''} ${hasSSID ? '\n - Social Security Number :chains:' : ''} ${hasPassword ? '\n - Password :lock:' : ''} ${hasAddress ? '\n - Address :map:' : ''} ** \n\n*There are ${message.guild.memberCount} members in this Discord server who can all potentially see and use any personal information that you send. In the first half of 2021, Discord banned over 470,000 non-spam accounts for misuse, cybercrimes, malware, and many other issues. Make sure to only share private and pesonal information with people you know and trust.* \n\n**Harpocrates deleted your message in case this was a mistake.** If you resend this message within the next **30 minutes**, he will assume this was not a mistake and that you understand the risks. If you'd like to allow this information to be sent in the future, or in the future you can use \"-bypass <msg>\" to skip this warning. \n\n**:exclamation:If you wish to resend this message, you can copy and paste it from below::exclamation:**`,
      "color": "FCBA03",
      "footer": {
        "text": message.content,
      }
    };

    message.member.send({
      embed
    });

    let msg = { "message": message.content, "timestamp": Date.now() }
    await db.set(message.author.id, msg);

    message.delete();
  }

  //Toggle Settings
  const msgParts = message.content.split(" ");
  if (msgParts.length == 2 && (msgParts[0] === '-off' || msgParts[0] === '-on')) {
    if(message.author.id === message.guild.ownerID) {

      let updatedSettings = await db.get(message.guild.id);

      if (msgParts[1] === 'scamAlert') {
        updatedSettings.settings.scamAlert = msgParts[0].substring(1);
      }
      else if (msgParts[1] === 'linkValidation') {
        updatedSettings.settings.linkValidation = msgParts[0].substring(1);
      }
      else if (msgParts[1] === 'privateInfoFilter') {
        updatedSettings.settings.privateInfoFilter = msgParts[0].substring(1);
      }
      else if (msgParts[1] === 'dailyTips') {
        updatedSettings.settings.dailyTips = msgParts[0].substring(1);
      }

      await db.set(message.guild.id, updatedSettings);

      message.channel.send("Changed Harpocrates settings.");
    }
    else {
      message.channel.send("Only the server owner can change Harpocrates settings.")
    }
  }

  // Link Validation
  if (message.content.includes("http")) {
    let messageData = await db.get(message.guild.id)
    if (messageData.settings.linkValidation !== 'on'){
      return;
    }

    const urls = [];
    message.content.split(" ").forEach(e => {
      if (e.includes("http")) {
        urls.push({ "url": e });
      }
    })

    const request = {
      "client": {
        "clientId": "Harpocrates",
        "clientVersion": "1.0.0"
      },
      "threatInfo": {
        "threatTypes": ["MALWARE", "SOCIAL_ENGINEERING"],
        "platformTypes": ["WINDOWS", "LINUX"],
        "threatEntryTypes": ["URL"],
        "threatEntries": urls
      }
    };

    fetch(`https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${config.google_key}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    })
      .then(response => response.json())
      .then(data => {
        if (Object.keys(data).length !== 0) {
          const embed = {
            "title": "**Suspicious Link**",
            "description": `:zipper_mouth: Harpocrates has detected that you attempted to post a potentially dangerous link in ${message.channel}, ${message.guild}. In order to protect server members Harpocrates has deleted the message.\n\n:white_check_mark: Please remember keep yourself and others safe!`,
            "color": "FC0303",
            "footer": {
              "icon_url": message.author.avatarURL({
                format: 'png',
                dynamic: true,
                size: 1024
              }),
              "text": message.author.username + "#" + message.author.discriminator + ": " + message.content,
            },
          };

          message.member.send({
            embed
          });

          message.delete();
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }
});

// Scam Alert
async function scamAlert() {
  console.log("Scam Check");
  const url = "https://www.consumer.ftc.gov/features/scam-alerts";
  const { data } = await axios.get(url)
    .catch((error) => {
      console.error('Error:', error);
    });;
  const $ = cheerio.load(data);
  const scam = $("#block-views-scam_alerts-block_1 > div > div.view-content > div:nth-child(1)");
  const name = $(scam).children("div:nth-child(1)").children("h2").children("a").text();
  const link = $(scam).children("div:nth-child(1)").children("h2").children("a").attr("href");
  const date = $(scam).children("div:nth-child(2)").children("span").text();
  const content = $(scam).children("div:nth-child(5)").children("div").text();

  const currentDate = (new Date()).getDate();
  if (currentDate > date.split(" ")[1].replace(",", "")) {
    return;
  }

  const embed = {
    "title": "**<:rotating_light:934637700731002970> SCAM ALERT <:rotating_light:934637700731002970>**",
    "description": "Alerting you to a new scam.",
    "color": "43B581",
    "footer": {
      "icon_url": bot.user.avatarURL({
        format: 'png',
        dynamic: true,
        size: 1024
      }),
      "text": bot.user.username + "#" + bot.user.discriminator,
    },
    "fields": [{
      "name": `**${name}**`,
      "value": `\n ${date} \n\n ${content} \n\n ${link}`
    }
    ]
  };

  guildChannel.forEach(async (infoChannel) => {
    let messageData = await db.get(infoChannel.guildId);
    if (messageData.settings.scamAlert !== 'on') {
      return;
    }
    infoChannel.channel.send({
      embed
    });
  })
}

// Daily Information
async function dailyInfo() {
  let index = await db.get("dailyId");

  console.log("Daily Information");
  const todaysInfo = information.list[parseInt(index) % information.list.length];
  console.log(todaysInfo);
  const embed = {
    "title": "**Daily Information <:calendar:934706458644316192>**",
    "description": "Daily reminders and or facts about data privacy and security.",
    "color": "43B581",
    "fields": [{
      "name": `**${todaysInfo.title}**`,
      "value": `\n${todaysInfo.description} \n\n Link: ${todaysInfo.link}\n`
    }
    ]
  };

  
  guildChannel.forEach(async (infoChannel) => {
    let messageData = await db.get(infoChannel.guildId);
    if (messageData.settings.dailyTips !== 'on') {
      return;
    }
    infoChannel.channel.send({
      embed
    });
  })

  await db.set("dailyId", index + 1);
}

// Checks for new scam every 6 hours (0 */6 * * *)
let scamCheck = new cron.CronJob('0 */6 * * *', async () => await scamAlert());
scamCheck.start();

// Posts daily info at 8AM every day (0 8 * * *)
// Use (* * * * *) to test daily info every minute
let postDailyInfo = new cron.CronJob('0 * * * *', async () => await dailyInfo());
postDailyInfo.start();

// Link to Discord
bot.login(config.token);