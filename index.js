'use strict'
// Custom error class for throwing and catching errors caused by user input and other expected errors
const UserInputError = global.UserInputError = class extends Error {}

// Core Node.js modules
const fs = require('fs'); global.fs = fs
const util = require('util'); global.util = util

// npm modules
const Discord = require('discord.js'); global.Discord = Discord
const Enmap = require('enmap'); global.Enmap = Enmap
const fetch = require('node-fetch'); global.fetch = fetch
const Jimp = require('jimp'); global.Jimp = Jimp

// Initialise client, binding it to the global scope so it's accessible everywhere
let client = global.client = new Discord.Client({
	disableEveryone: true,
	disabledEvents: ['TYPING_START']
})

// Configurations
client.config = require('./config.json')

// Live code evaluation through command line
process.openStdin().on('data', function (input) {
	try {
		console.log(require('util').inspect(eval(input.toString()), {colors: true}))
	} catch (err) {
		console.error(err)
	}
})

// Language & random message picking
client.lang = {
	perms: require('./language/perms.json').perms,
	permnames: require('./language/perms.json').names,
	presences: require('./language/plays.json').text,
	pasta: require('./language/pasta.json').text,
	
	presenceHtr: [],
	play: function() {
		let pick, yet = true
		while (yet) {
			pick = Math.floor(Math.random() * this.presences.length)
			if(!this.presences.includes(pick)) yet = false
		}
		while (this.presenceHtr.length > 30) this.presenceHtr.shift()
		this.presenceHtr.push(pick)
		client.user.setActivity(this.presences[pick])
	},
	pastaHtr: [],
	paste: function() {
		let pick, yet = true
		while (yet) {
			pick = Math.floor(Math.random() * this.pasta.length)
			if(!this.pastaHtr.includes(pick)) yet = false
		}
		while (this.pastaHtr.length > 30) this.pastaHtr.shift()
		this.pastaHtr.push(pick)
		return this.pasta[pick]
	}
}

// Utilities and shortcuts
client.util = {
	getPre: function (msg) {
		if (msg.channel.type === 'dm') return ''
		let gcf = client.data.guilds.get(msg.guild.id)
		if (gcf && gcf.prefix) return gcf.prefix
		return client.config.prefix
	},
	throw: function (msg, reply, opt) {
		msg.react('❌').catch(()=>undefined)
		return msg.channel.send(reply, opt).catch(()=>undefined)
	},
	done: function (msg, reply, opt) {
		msg.react('✅').catch(()=>undefined)
		return msg.channel.send(reply, opt).catch(()=>undefined)
	},
	mkEmbed: function (title, desc, fields, image) {
		return { color: client.config.embedColor, title: title, description: desc, fields: fields, image: image ? { url: image } : undefined }
	},
	permName: function (perm) {
		if (Array.isArray(perm)) {
			return perm.map(function (perm) {
				return client.lang.permnames[client.lang.perms.indexOf(perm)]
			}).join(', ')
		} else return client.lang.permnames[client.lang.perms.indexOf(perm)]
	},
	getMember: function (msg, thing) {
		let guild = msg.guild
		if (!guild) {
			guild = {members: new Discord.Collection()}
			guild.members.set(client.user.id, {user: client.user})
			guild.members.set(msg.author.id, {user: msg.author})
		}
		let regexr = /^<@!?(\d{17,18})>$/.exec(thing) || /^(\d{17,18})$/.exec(thing)
		if (regexr) return guild.members.get(regexr[1])
		let h = thing.toLowerCase()
		return guild.members.find(function (member) {
			return member.nickname && member.nickname.toLowerCase().startsWith(h) || member.user.tag.toLowerCase().startsWith(h)
		})
	},
	getChannel: function (msg, thing) {
		let regexr = /^<#(\d{17,18})>$/.exec(thing) || /^(\d{17,18})$/.exec(thing)
		return regexr ? msg.guild.channels.get(regexr[1]) : null
	},
	argSq: function (argStr) {
		let str = ''
		for (let aPos of argStr) {
			str += `[${aPos}] `
		}
		return str
	},
	clean: function (text) {
		if (typeof (text) === 'string') return text.replace(/@/g, '@' + String.fromCharCode(8203))
		else return text
	},
	getInv: function (str1) {
		let reg = /(?:discordapp\.com\/invite|discord.gg)\/([a-zA-Z0-9\-]+)/g, array1, array2 = []
		while ((array1 = reg.exec(str1)) !== null) array2.push(array1[1])
		return array2
	},
	checkInv: async function (code) {
		if (code.length > 10) return false
		return client.fetchInvite(code).then(()=>true).catch(()=>false)
	}
}

// Helpers for the `help` command
client.help = {
	cats: {
		info: 'Help & Information',
		util: 'Utility',
		mod: 'Moderation',
		fun: 'Fun',
		strp: 'String processing',
		img: 'Image manipulation',
		config: 'Configuration',
		maint: 'Maintenance'
	},
	fields: [],
	build: function () {
		this.fields = []
		let helpObj = {}
		for (let cat of Object.keys(this.cats)) {
			helpObj[cat] = {
				name: this.cats[cat],
				commands: []
			}
		}
		client.commands.map(function (a, b) { if (a.cat) helpObj[a.cat].commands.push(b) })
		let x = 0
		for (let i of Object.keys(helpObj)) {
			this.fields[x] = { name: helpObj[i].name, value: '' }
			for (let ii = 0; ii < helpObj[i].commands.length; ii++) {
				this.fields[x].value += '`' + helpObj[i].commands[ii] + '`'
				if (ii !== helpObj[i].commands.length - 1) this.fields[x].value += ', '
			}
			if (this.fields[x].value !== '') x++
		}
		if (this.fields[x] && this.fields[x].value == '') this.fields.pop()
	}
}

// Command cooldown engine
client.cd = {
	users: new Set(),
	addCooldown: function (id, interval = 2000) {
		this.users.add(id)
		setTimeout(function () {
			client.cd.users.delete(id)
		}, interval)
	},
	has: function (thing) {
		return this.users.has(thing)
	}
}

// Load commands
client.commands = new Enmap()
fs.readdir('./commands/', function (err, files) {
	if (err) return console.error(err)
	files.map(function (file) {
		if (!file.endsWith('.js')) return
		let props = require(`./commands/${file}`)
		let commandName = file.split('.')[0]
		client.commands.set(commandName, props)
	})
	client.help.build()
})

// Load ready event
client.on('ready', require('./events/ready.js'))

// Persistent Enmaps for storing data of users / guilds / ect.
client.data = {
	writeGuild: function (key, data) {
		for (let prop of Object.keys(data)) if ((data[prop] !== 0 || data[prop] !== false) && !data[prop] || (Array.isArray(data[prop]) && data[prop].length === 0)) delete data[prop]
		if (Object.keys(data).length === 0) this.guilds.delete(key)
		else this.guilds.set(key, data)
	},
	writeUser: function (key, data) {
		for (let prop of Object.keys(data)) if ((data[prop] !== 0 || data[prop] !== false) && !data[prop] || (Array.isArray(data[prop]) && data[prop].length === 0)) delete data[prop]
		if (Object.keys(data).length === 0) this.users.delete(key)
		else this.users.set(key, data)
	},
	guilds: new Enmap({
		name: 'guilddata',
		dataDir: './data/guilds'
	}),
	users: new Enmap({
		name: 'userdata',
		dataDir: './data/users'
	})
}

// Handle Websocket errors properly
process.on('unhandledRejection', console.error)
client.on('error', function (err) {console.log(err.message)})
console.time('login')
// Login
client.login(client.config.token)