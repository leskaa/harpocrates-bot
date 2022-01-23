const cheerio = require("cheerio");
const axios = require("axios");

exports.run = async (client, message, args) => {
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

  const embed = {
    "title": "**Recent Scam <:bangbang:934901511723569222>**",
    "description": "Most recent scam found at https://www.consumer.ftc.gov/features/scam-alerts",
    "color": "43B581",
    "fields": [{
      "name": `**${name}**`,
      "value": `\n ${date} \n\n ${content} \n\n For More Information: ${link}`
    }
    ]
  };
  message.channel.send({
    embed
  });
};