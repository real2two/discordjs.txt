const settings = require("./settings.json")
const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require("fs");
const cooldown = new Set();

client.on('ready', () => {
  console.log(`Bot is ready!`);
});

client.on('message', async message => {
  try {
    if (message.content.startsWith(settings["prefix"])) {
      let removeprefix = message.content.slice(settings["prefix"].length);
      if (removeprefix === "") return;
      
      // string before space function
      done = 0
      test = removeprefix + " "
      newvar = ""
      while (!test.toString().startsWith(" ")) {
        newvar = newvar.toString() + test.toString().charAt(0)
        test = test.toString().slice(2)
      }
      let command = removeprefix.slice(-(message.content.toString().length - (test.length - 1)))
      // end function
      
      if (fs.existsSync(`./commands/${command}.txt`)) {
        
        if (cooldown.has('global')) {
          return
        } else {
          cooldown.add('global');
          setTimeout(() => {
            cooldown.delete('global');
          }, settings["globalcooldown"]);
        }
        
        if (cooldown.has(message.author.id)) {
          return
        } else {
          cooldown.add(message.author.id);
          setTimeout(() => {
            cooldown.delete(message.author.id);
          }, settings["usercooldown"]);
        }
        
        let code = fs.readFileSync(`./commands/${command}.txt`).toString().split('\n');
        if (code.toString() === "") return;
        
        let lines = code.length - 1
        
        await loopCommand(client, message, code, 0, lines)
        return
      }
    }
  } catch(err) {
    console.log(err)
  }
});

client.login(settings["token"])

async function simpleEmbed(message, author, description) {
  //let config = require("./config.json");
  try {
    const embed = new Discord.MessageEmbed()
      .setAuthor(author)
      .setColor("RANDOM")
      .setDescription(description)
    message.channel.send({embed});
  } catch(err) {
    console.log(err)
  }
  return;
}

async function loopCommand(client, message, code, loopnum, lines) {
  try {
    let lineofcodetest = code[loopnum].toString();
    
    // remove space function
    test = lineofcodetest.toString()
    done = 0
    while (done == 0) {
      if (test.toString().startsWith(" ") || test.toString().startsWith("  ")) {
        test = test.toString().slice(1)
      } else {
        done = 1
      }
    }
    //end function
    let lineofcode = test.toString().split(' ');
    let args = test.toString().slice(lineofcode[0].toString().length + 1)
    
    if (lineofcode === "") {
    } else {
      if (lineofcode[0].toString() !== "") {
        if (fs.existsSync(`./data/${lineofcode[0].toString()}.js`)) {
          let eventFile = await require(`./data/` + lineofcode[0].toString() + ".js");
          let logs = await eventFile.run(client, message, args, loopnum + 1, lines + 1); // client (discord), message (discord), args (arguments of the line in the file), loopnum (what line of code it is executing), maxlines (the amount of lines the executing code file contains)
          if (!isNaN(eventFile.log)) {
            console.log(eventFile.log)
          }
          if (!isNaN(eventFile.loopnum)) {
            loopnum = eventFile.loopnum - 2;
            if (loopnum > lines) {
              loopnum = lines
            }
          }
        } else {
          console.log("Error on line " + (loopnum + 1).toString() + ": Invalid event name.")
          return
        }
      }
    }
    loopnum = loopnum + 1
    if (loopnum <= lines) {
      setTimeout(() => {
        loopCommand(client, message, code, loopnum, lines)
      }, settings["prefix"])
    }
  } catch(err) {
    console.log(err)
  }
}
