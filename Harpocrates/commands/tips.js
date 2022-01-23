exports.run = (client, message, args) => {
  const tab = "\u200B \u200B \u200B \u200B";
  const point = "<:small_blue_diamond:934695177304567838>"
  let request = "";

  const messageContent = message.content.split(" ");
  if(messageContent.length === 1) {
    message.channel.send("Try using **-tips** [account|hardware|data]");
    return;
  } else {
    request = messageContent[1];
  }

  const account = 
    `${tab}${point}Use Two-Factor (2FA) or Multi-Factor Authentication if provided.\n`
    + `${tab}${point}Be vigilant about phishing scams.\n`
    + `${tab}${point}Protect personal identifiable information.\n`
    + `${tab}${point}Review online accounts and bank charges for unauthorized access.\n`
    + `${tab}${point}Use a strong passwords and a password management tool such as LastPass.\n`
    + `\n${tab}***Password Tips***\n`
    + `${tab}${tab}1) Never use personal information such as phone numbers or birthdays\n`
    + `${tab}${tab}2) Include a combination of letters, numbers, and symbols\n`
    + `${tab}${tab}3) Prioritize password length\n`
    + `${tab}${tab}4) Never repeat passwords that have been used before\n`
    + `${tab}${tab}5) Avoid using real words that exist in the dictionary as written\n`
    + `${tab}${tab}More Information at https://us.norton.com/internetsecurity-privacy-password-security.html\n\n`

  const hardware = 
    `${tab}${point}Keep software up to date.\n`
    + `${tab}${point}use Anti-Virus protection and a firewall.\n`
    + `${tab}${point}Be careful of what is downloaded and from where.\n`;

  const data =
    `${tab}${point}Use a Virtual Private Network (VPN)\n`
    + `${tab}${point}Try to avoid using public Wi-Fi, especially without a VPN.\n`
    + `${tab}${point}Backup data regularly to a secure location.\n`
    + `${tab}${point}Avoid accepting unnecessary cookies when browsing the web.\n`;

  let embedContent = {"name": "General Tips", "value": "General Cybersecurity Tips"};
  switch(request.toLowerCase()) {
    case "account":
      embedContent.name = "Account Security Tips";
      embedContent.value = account;
      break;
    case "hardware":
      embedContent.name = "Hardware Tips";
      embedContent.value = hardware;
      break;
    case "data":
      embedContent.name = "Data Tips";
      embedContent.value = data;
      break;
  }

  const embed = {
    "title": "**Helpful Data Privacy Tips <:lock:934681533296574504>**",
    "description": "Command provides a few different tips that can that can improve a users data privacy and security.",
    "color": "000195",
    "fields": [{
      "name": `**${embedContent.name}**`,
      "value": embedContent.value,
    }
    ]
  };

  message.channel.send({
    embed
  });
};