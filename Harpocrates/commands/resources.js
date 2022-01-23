exports.run = (client, message, args) => {
  const tab = "\u200B \u200B \u200B \u200B";
  const point = "<:small_blue_diamond:934695177304567838>"

  const resourceList =
    `${tab}${point}Norton: https://us.norton.com/internetsecurity\n`
    + `${tab}${point}LastPass: https://www.lastpass.com\n`
    + `${tab}${point}ICO: https://ico.org.uk/about-the-ico/news-and-events/news-and-blogs/\n`
    + `${tab}${point}VPN List: https://www.pcmag.com/picks/the-best-vpn-services\n`
    + `${tab}${point}Antivirus List: https://www.pcmag.com/picks/the-best-antivirus-protection\n`
    + `${tab}${point}Data Privacy Tips: https://us.norton.com/internetsecurity-privacy-protecting-your-privacy-online.html\n`
    + `${tab}${point}UBlock Origin: https://ublockorigin.com\n`
    + `${tab}${point}FTC: https://www.consumer.ftc.gov/articles/how-recognize-and-avoid-phishing-scams\n`
    + `${tab}${point}FTC: https://www.consumer.ftc.gov/features/scam-alerts\n`;

  const embed = {
    "title": "**Resource List <:globe_with_meridians:934695100892717096>**",
    "description": "Command provides various resources about security software, data privacy, and more.",
    "color": "000195",
    "fields": [{
      "name": "**Resources**",
      "value": resourceList,
    }
    ]
  };

  message.channel.send({
    embed
  });
};