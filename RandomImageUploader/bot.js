//Part 1: Discord bot set up
//=================================================
// Import the discord.js module
const Discord = require('discord.js');
const client = new Discord.Client(); // Create an instance of a Discord client

// The token of your bot - https://discordapp.com/developers/applications/me
const token = 'YOUR TOKEN HERE';

// The ready event is vital, it means that your bot will only start reacting to information
// from Discord _after_ ready is emitted
client.on('ready', () => {
    console.log('I am ready!');
});

const prefix = '!';

var userInputtedPath;
var arrPaths = [];
var totalImages = 1;
var fs = require("fs"),
    path = require("path");



    
client.on('message', message => {
    if (!message.content.startsWith(prefix)) return;  // Ignore if it doesn't start with prefix
    else if (message.channel.type === "dm") return;  // Ignore DM channels.
    else if (message.author.bot) return;             // Ignore if author is a bot
    else{
        const args = message.content.slice(prefix.length).trim().split(/ +/g);
        const command = args.shift().toLowerCase();

        if (command === 'tracefolder'){
            userInputtedPath = args[0];
            if (userInputtedPath === undefined){
                message.channel.send(`ERROR: Missing argument 0.`);
                return;
            } 
            else if (!fs.existsSync(userInputtedPath)) {
                message.channel.send('Error: Sorry, the path you entered does not exist. Please try again.');
                return;
            }            
            message.channel.send(`Activating Random Image command using path: ${userInputtedPath}`);
            arrPaths = [];
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
            message.channel.send(`Folder has been traversed. Your command is ready to use.`);

        }
        if (command === 'random') {
            var file = new Discord.Attachment();
            var picturePath = arrPaths[Math.floor(Math.random()*arrPaths.length)];
            try {
               fs.accessSync(picturePath);
            } catch (e) {
              fs.mkdirSync(picturePath);
              message.channel.send('Error: Sorry, the path you entered does not exist. Please try again.')
            }
    
            file.setAttachment(picturePath);
            message.channel.send(file);
        }
    }


}) 
// Log our bot in
client.login(token);

/** EXTRA FUNCTIONS  */


function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}