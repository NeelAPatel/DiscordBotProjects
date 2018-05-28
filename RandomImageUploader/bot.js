//Part 1: Discord bot set up
//=================================================
// Import the discord.js module
const Discord = require('discord.js');
const client = new Discord.Client({autoReconnect:true}); // Create an instance of a Discord client

// The token of your bot - https://discordapp.com/developers/applications/me
const token = 'INSERT TOKEN HERE';
// Link to invite the bot: 


// The ready event is vital, it means that your bot will only start reacting to information
// from Discord _after_ ready is emitted
client.on('ready', () => {
    console.log('I am ready!');
    client.user.setUsername("RandomBot");
});

const prefix = '!';

var userInputtedPath;
var arrPaths = [];
var totalImages = 0;
var allowRandomCmd = 0;
var fs = require("fs"),
    path = require("path");


// maybe this will fix the EAI_AGAIN error. 

client.on('disconnect', function(erMsg, code) {
    console.log('----- Bot disconnected from Discord with code ', code, ' for reason: ', erMsg, '-----');
    client.connect();
});

client.on('message', message => {
    if (!message.content.startsWith(prefix)) return;  // Ignore if it doesn't start with prefix
    else if (message.channel.type === "dm") return;  // Ignore DM channels.
    else if (message.author.bot) return;             // Ignore if author is a bot
    else{
        const args = message.content.slice(prefix.length).trim().split(/ +/g);
        const command = args.shift().toLowerCase(); //Changes command text to lowercase
        
        //Command 0
        if (command === 'commands'){
            sendCommands(message);
        }

        //Command 1
        if (command === 'currentpath' || command === 'path'|| command === 'currpath'){
            if (userInputtedPath === undefined){
                sendMessage(message, 'ERROR', 'ERROR', 'Path is not defined. Please run !setPath <Path>.');
                return;
            }
            else {
                sendMessage(message, 'WORKING', 'Trace complete!', `I have analyzed ${totalImages} photos in *${userInputtedPath}*`);
                return;
            }
                
        }

        //Command 2
        if (command === 'setpath' || command === 'tracefolder'){
            userInputtedPath = args[0];
            if (userInputtedPath === undefined){
                sendMessage(message, 'ERROR', 'ERROR', `Missing path argument. Total Images is [${totalImages}]`);
                return;
            } 
            else if (!fs.existsSync(userInputtedPath)) {
                sendMessage(message, 'ERROR', 'ERROR', `The path you entered does not exist.\nEntered Path: *${userInputtedPath}*`);
                return;
            }
            
            sendMessage(message, 'WORKING', 'Analyzing... ', `Activating !random using the path: *${userInputtedPath}*`);
            totalImages = 0;
            arrPaths = [];
            allowRandomCmd = 1;
            fs.readdir(userInputtedPath, function(err,files){
                if (err) {
                    throw err;
                }
            
                files.map(function(file){
                    return path.join(userInputtedPath, file);
                }).filter(function (file){
                    return fs.statSync(file).isFile();
                }).forEach(function(file){
                    arrPaths.push(file);
                    totalImages += 1;
                    console.log("%s (%s)", file, path.extname(file));
                })    
            });
            sendMessage(message, 'WORKING', 'Analysis Complete! ', `!random is ready to use!`);

        }

        //Command 3
        if (command === 'random') {
            if (allowRandomCmd == 0){
                sendMessage(message, 'ERROR', 'ERROR', `The path you entered does not exist.\nEntered Path: *${userInputtedPath}*`);
                return;
            }
            var file = new Discord.Attachment();
            
            var randomNum = Math.floor(Math.random()*arrPaths.length);
            var picturePath = arrPaths[Math.floor(Math.random()*arrPaths.length)];
            try {
               fs.accessSync(picturePath);
            } catch (e) {
              fs.mkdirSync(picturePath);
              sendMessage(message, 'ERROR', 'ERROR', `The path you entered does not exist. Please try again.`);
            }
    
            file.setAttachment(picturePath);
            message.channel.send(file);
            console.log("\nRandom Img: [%d][%s]", randomNum,  picturePath);
           // message.channel.send(`ImageNum: ${randomNum}`);
        }


        //Command 4
        if (command === 'refreshpictures' || command === 'refreshfolder'){
            if (allowRandomCmd === 1){
                sendMessage(message, 'WORKING', 'Refreshing... ', `Refreshing !random using the path: *${userInputtedPath}*`);
                totalImages = 0;
                arrPaths = [];
                allowRandomCmd = 1;
                fs.readdir(userInputtedPath, function(err,files){
                    if (err) {
                        throw err;
                    }
                
                    files.map(function(file){
                        return path.join(userInputtedPath, file);
                    }).filter(function (file){
                        return fs.statSync(file).isFile();
                    }).forEach(function(file){
                        arrPaths.push(file);
                        totalImages += 1;
                        console.log("%s (%s)", file, path.extname(file));
                    })    
                });
                sendMessage(message, 'WORKING', 'Refreshing Complete! ', `!random is ready to use!`);
            }
            else{
                sendMessage(message, 'ERROR', 'ERROR', 'Path is not defined. Please run !setPath <Path>.');
            }           
        }
    }


});
// Log our bot in
client.login(token);

/** FUNCTIONS  **/

function sendCommands(message){
    const embed = new Discord.RichEmbed()
                .setTitle("Commands")
                .setAuthor("RandomBot", "https://cdn.discordapp.com/embed/avatars/4.png")
                .setColor("#FF95FF")
                .setFooter("Footer Text")
                .setDescription("Here's a list of commands that I can use at the moment.\n=======================================")
                
                .addField("!commands", "shows this list of available commands")
                .addField("!currentPath | path | currPath", "`shows where the current pictures are stored`")
                .addField("!setPath | traceFolder <Path>", "`Sets the path and traces the folder for pictures`")
                .addField("!refreshPictures", "refreshes the folders for any new pictures")
                .addField("!random", "`shows a random image from specified path`");

    message.channel.send({embed});
}

function sendMessage(message,STATE, strTitle, strDesc){
    

    //States
    var color = "#FF95FF"; //Pink
    if (STATE === 'ERROR'){
        color = "#F04747"; //Red
    }
    else if (STATE === 'WORKING'){
        color = "#43B581"; //Green
    }
    
        


    const embed = new Discord.RichEmbed()
        .setAuthor("RandomBot", "https://cdn.discordapp.com/embed/avatars/4.png")
        .setFooter("Footer Text")
        
        .setColor(color)
        .setTitle(strTitle)
        .setDescription(strDesc);
        

        message.channel.send({embed});
}


function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}