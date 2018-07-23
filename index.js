const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('fs');
const prefix = ".";
let data = JSON.parse(fs.readFileSync('./data.json', 'utf8'));

client.on("ready", () => {
  const user = client.user;
  user.setActivity(".help");
  user.setStatus("online");
  console.log("All good!");
});

client.on("message", message => {
  if (!message.content.startsWith(prefix)) return;
  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  const num = /^\d+$/;
  const duitData = JSON.parse(fs.readFileSync('./data.json'));
  const date = new Date();
  switch (command) {
    case 'ping':
      message.channel.send("Pong!");
      break;
    case 'masuk':
      if (isNaN(args[0])) return message.channel.send("Bukan angka!");
      if (message.guild.channels.find("name", "log") === null) return message.channel.send("Tolong **buat text channel dengan nama _log_** untuk menggunakan fitur ini.");
      if (!data) data = {
        duit: 0
      }
      let total = data.duit + Number(args[0]);
      // if (args[0].match(/\w/g)) return message.channel.send("Bukan angka.");
      data = {
        duit: total
      }
      message.channel.send(`${args[0]} telah ditambahkan.`);
      fs.writeFile('./data.json', JSON.stringify(data), (err) => {
        if (err) console.log(err.stack)
      });
      var embed = new Discord.RichEmbed()
        .setColor(0xAED581)
        .addField("Penambahan dana sebesar:", (Number(args[0])).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'))
        .addField("Total uang:", (duitData.duit + Number(args[0])).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'))
        .setFooter(`Pada tanggal: ${date.getMonth()} / ${date.getDate()} / ${date.getFullYear()}`);
      message.guild.channels.find("name", "log").send({
        embed
      });
      break;
    case 'keluar':
      if (isNaN(args[0])) return message.channel.send("Bukan angka!");
      if (message.guild.channels.find("name", "log") === null) return message.channel.send("Tolong **buat text channel dengan nama _log_** untuk menggunakan fitur ini.");
      let total_keluar = data.duit - Number(args[0]);
      // if (args[0].match(/\w/g)) return message.channel.send("Bukan angka.");
      data = {
        duit: total_keluar
      }
      message.channel.send(`${args[0]} telah dikurangkan.`);
      fs.writeFile('./data.json', JSON.stringify(data), (err) => {
        if (err) console.log(err.stack)
      });
      var embed = new Discord.RichEmbed()
        .setColor(0x795548)
        .addField("Pengurangan dana sebesar:", (Number(args[0])).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'))
        .addField("Sisa uang:", (duitData.duit - Number(args[0])).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'))
        .setFooter(`Pada tanggal: ${date.getMonth()} / ${date.getDate()} / ${date.getFullYear()}`);
      message.guild.channels.find("name", "log").send({
        embed
      });
      break;
    case 'duit':
      message.channel.send(`Uang saat ini :: ${(duitData.duit).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`, {
        code: "asciidoc"
      });
      break;
    case 'set':
      data = {
        duit: Number(args[0])
      }
      message.channel.send(`Uang diset ke ${args[0]}.`);
      fs.writeFile('./data.json', JSON.stringify(data), (err) => {
        if (err) console.log(err.stack)
      });
      break;
    case 'help':
      message.channel.send(`= commands =\nmasuk        :: Duit Masuk\nkeluar       :: Duit Keluar/Terpakai\nduit         :: Duit saat ini.\nPenggunaan   :: masuk <berapa_duit_masuk> dan keluar <berapa_duit_keluar>`, {
        code: "asciidoc"
      });
      break;
  }
});

client.login(require('./config.json').token);