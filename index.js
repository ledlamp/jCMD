'use strict'
process.on('unhandledRejection', err => console.log(util.inspect(err)))

// Custom error class for throwing and catching errors caused by user input and other expected errors
const UserInputError = class extends Error {}; global.UserInputError = UserInputError

// Core Node.js modules
const fs = require('fs'); global.fs = fs
const util = require('util'); global.util = util

// npm modules
const Discord = require('discord.js'); global.Discord = Discord
const Enmap = require('enmap'); global.Enmap = Enmap
const fetch = require('node-fetch'); global.fetch = fetch
const Jimp = require('jimp'); global.Jimp = Jimp

const Client = require('./Client.js')

let client = new Client({disableEveryone: true}); global.client = client

// Eval through console
let stdin = process.openStdin()
stdin.on('data', function (input) {
	let msg = input.toString()
	try {
		console.log(util.inspect(eval(msg)))
	} catch (err) {
		if (err) console.log(err)
	}
})

// Login
console.time('login')
client.login(client.config.token)