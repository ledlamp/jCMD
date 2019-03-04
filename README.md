# Welcome to jCMD
jCMD is a Discord bot specialising in string processing and manipulation, written by reVerb#0001.
It is written in Node.js and is based on the Discord.js library: https://discord.js.org/.

# What's new
The codebase has gone through its third rewrite, which improves a lot from the previous framework. This time, functions no longer pass the client object around in a messy manner. Instead, it's binded to the global scope along with other libraries which might be used across many modules. The client object itself has been rewritten all over and things got reorganised for easier usage. Utilities are improved in performance and usability, user/guild data is now stored in persistent Enmaps.

Most commands are currently missing and they will probably come back soon. Some terrible commands will not survive this comparably strict procedure. Expect some of them to be gone forever.

# How to set up this bot
*I will assume that you are familiar with Node, the Linux command line, and how to edit a JSON file.*

  Do `npm install`.
  Rename the `config_template.json` to `config.json`, then modify the file's contents to the info you have. Add a folder named `data` and then make folders named `guilds` and `users` inside `data`.
  
  To run the bot, simply do `node index`.
