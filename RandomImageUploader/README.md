# DiscordBot - Random Image Uplaoder
## Function
### !traceFolder <Path> 
The bot will check if there is a parameter and if it exists or not. 
If everything works as intended, the bot will then trace through the folder for absolute paths of files and store the strings in an array. 

### !random
The bot generates a random number, chooses that index in the array and uploads it into the chat. 

## Limitations
- Inviting this exact bot to multiple servers will mean that it will be able to use the command there too.
- Deleting an image inside the folder while the bot is running will cause an error if !random chooses that file
- Adding a new image will not be eligible for upload until you run !traceFolder <path> again, as it needs to traverse the folder to find the images. 
