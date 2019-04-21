'use strict'
process.on('unhandledRejection', err => console.log(util.inspect(err)))

// Custom error class for throwing and catching errors caused by user input and other expected errors
const UserInputError = class extends Error {
	/**
	 * Error message
	 * @param {String} message
	 */
	constructor(message) {
		super(message)
	}
	toString() {
		return this.message
	}
}

// Core Node.js modules
const fs = require('fs')
const util = require('util')

// npm modules
const fetch = require('node-fetch')
const Jimp = require('jimp')
Object.assign(global, {
	UserInputError,
	fs,
	util,
	fetch,
	Jimp
})

const Client = require('./Client.js')
let client = new Client({
	messageCacheMaxSize: 20,
	messageCacheLifetime: 200,
	messageSweepInterval: 300,
	disabledEvents: ['TYPING_START'],
	disableEveryone: true
})
Object.assign(global, {client})

// Eval through console
require('repl').start()

// Login
console.time('login')
client.login(client.config.token)