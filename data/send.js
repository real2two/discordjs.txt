const Discord = require("discord.js")

exports.run = (client, message, arguments, loopnum, maxlines) => {
  if (arguments[0]) {
    msg = arguments.toString()
    newmsg = sendLoop(msg)
    newmsg.then(function(result) {
      message.channel.send(result)
    });
  } else {
    exports.log("Error on line " + loopnum.toString() + `: Improper usage of "send". There should be at least one argument.`);
  }
}

async function sendLoop(test) {
  newmsg = ""
  while (test !== "") {
    if (test.startsWith('\\')) {
      newmsg = newmsg + test.charAt(1).toString()
      test = test.slice(2).toString()
    } else if (test.startsWith("math[")) {
      test = test.slice(5).toString()
      
      newmsg1 = await newmsg // some bug or something changes this variable
      // until next space function
      test1 = " " + test.toString()
      test2 = ""
      done = 0
      while (done == 0) {
        if (test1.toString().startsWith("]") || test1.toString() === "") {
          done = 1
        } else {
          test2 = test2 + await test1.toString().charAt(0).toString()
          test1 = await test1.toString().slice(1)
        }
      }
      if (test2.toString().slice(test2.length - 1).toString() === "]") {
        test2 = test2.toString().slice(0, -1)
      }
      //end function
      
      newmsg = await newmsg1 // some bug or something changes this variable
      
      math = test2.toString();
      test = test.slice(math.length)
      mathtest = await math.toString().replace(/\s/g, "").toString().replace(/[/0/1/2/3/4/5/6/7/8/9/(/)/*/+/-/]/g, "").toString()
      if (mathtest === "") {
        try {
          newmsg = newmsg.toString() + eval(math).toString()
        } catch(junk) {
          newmsg = newmsg.toString() + "undefined"
        }
      } else {
        newmsg = newmsg.toString() + "undefined"
      }
    } else {
      newmsg = await newmsg + await test.charAt(0).toString()
      test = await test.slice(1).toString()
    }
  }
  return newmsg;
}
