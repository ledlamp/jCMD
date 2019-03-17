'use strict'
process.on('unhandledRejection', err => console.log(util.inspect(err)))

// Custom error class for throwing and catching errors caused by user input and other expected errors
const UserInputError = class extends Error {}; global.UserInputError = UserInputError

// Core Node.js modules
const fs = require('fs')
const util = require('util')

// npm modules
const Discord = require('discord.js')
const Enmap = require('enmap')
const fetch = require('node-fetch')
const Jimp = require('jimp')
Object.assign(global, {
	UserInputError,
	fs,
	util,
	Discord,
	Enmap,
	fetch,
	Jimp
})

const Client = require('./Client.js')
let client = new Client({disableEveryone: true})
Object.assign(global, {client})

// Eval through console
process.openStdin().on('data', function (input) {
	let msg = input.toString()
	try {
		console.log(util.inspect(eval(msg), {colors: true}))
	} catch (err) {
		if (err) console.log(err)
	}
})

// Login
console.time('login')
client.login(client.config.token)