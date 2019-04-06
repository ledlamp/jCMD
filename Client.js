const Discord = require('discord.js')
const Enmap = require('enmap')
Object.assign(global, {Discord, Enmap})
module.exports = class extends Discord.Client {
	constructor(ClientOptions) {
		super(ClientOptions)
		let client = this
		this.config = require('./config.json')
		this.lang = {
			perms: require('./language/perms.json').perms,
			permnames: require('./language/perms.json').names,
			presences: require('./language/plays.json'),
			pasta: require('./language/pasta.json'),
			presenceHtr: [],
			/**
			 * Sets the bot's presence to a random string.
			 */
			play: function() {
				let pick, yet = true
				while (yet) {
					pick = Math.floor(Math.random() * this.presences.length)
					if(!this.presences.includes(pick)) yet = false
				}
				while (this.presenceHtr.length > 30) this.presenceHtr.shift()
				this.presenceHtr.push(pick)
				client.user.setActivity(this.presences[pick]).catch(()=>undefined)
			},
			pastaHtr: [],
			/**
			 * @returns {String} Random copypasta
			 */
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
		this.util = {
			/**
			 * Gets the supposed prefix of a message if it were to contain a command
			 * @param {Message} msg The message
			 * @returns {String} Prefix
			 */
			getPre: function (msg) {
				if (msg.channel.type === 'dm') return ''
				let gcf = client.data.guilds.get(msg.guild.id)
				if (gcf && gcf.prefix) return gcf.prefix
				return client.config.prefix
			},
			/**
			 * Acts like Text/DMChannel#send, but also reacts to the message with a cross.
			 * @param {Message} msg The message to react and reply to
			 * @param {String} [reply] The content of the reply
			 * @param {MessageOptions|Discord.Attachment|Discord.RichEmbed|object} [opt] The content of the reply
			 * @returns {Promise<Discord.Message|null>} Resulting message sent
			 */
			throw: function (msg, reply, opt) {
				msg.react('❌').catch(()=>undefined)
				return new Promise (function (res) {
					msg.channel.send(reply, opt)
					.then(function (out) {
						res(out)
					})
					.catch(function () {
						res(null)
					})
				})
			},
			/**
			 * Acts like Text/DMChannel#send. Catches errors.
			 * @param {Message} msg The message to reply to
			 * @param {String} [reply] The content of the reply
			 * @param {MessageOptions|Discord.Attachment|Discord.RichEmbed|object} [opt] The content of the reply
			 * @returns {Promise<Discord.Message|null>} Resulting message sent
			 */
			done: function (msg, reply, opt) {
				return new Promise (function (res) {
					msg.channel.send(reply, opt)
					.then(function (out) {
						res(out)
					})
					.catch(function () {
						res(null)
					})
				})
			},
			/**
			 * Embed object construction.
			 * @param {String} title Embed title
			 * @param {String} desc Embed description
			 * @param {Array<Object>} [fields] Embed fields
			 * @param {String} [image] Embed image
			 * @returns {Object} Embed object
			 */
			mkEmbed: function (title, desc, fields, image) {
				return { color: client.config.embedColor, title: title, description: desc, fields: fields, image: image ? { url: image } : undefined }
			},
			/**
			 * Takes a permission string/array and returns the corresponding human-readable permission name(s).
			 * @param {String|Array<String>} perm Permission string/array
			 * @returns {String} Permission name(s)
			 */
			permName: function (perm) {
				if (Array.isArray(perm)) {
					return perm.map(function (perm) {
						return client.lang.permnames[client.lang.perms.indexOf(perm)]
					}).join(', ')
				} else return client.lang.permnames[client.lang.perms.indexOf(perm)]
			},
			/**
			 * Member targeting with string.
			 * @param {Message} msg Message invoking the targeting
			 * @param {String} thing Query
			 * @returns {GuildMember|null} Result
			 */
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
					return member.nickname && member.nickname.toLowerCase() === h || member.user.username.toLowerCase() === h || member.user.tag.toLowerCase() === h
				}) || guild.members.find(function (member) {
					return member.nickname && member.nickname.toLowerCase().startsWith(h) || member.user.tag.toLowerCase().startsWith(h)
				})
			},
			/**
			 * Like getMember, but only accepts mentions and IDs.
			 * @param {Message} msg Message invoking the targeting
			 * @param {String} thing Query
			 * @returns {GuildMember|null} Result
			 */
			getMemberStrict: function (msg, thing) {
				let regexr = /^<@!?(\d{17,18})>$/.exec(thing) || /^(\d{17,18})$/.exec(thing)
				if (regexr) return msg.guild.members.get(regexr[1])
			},
			/**
			 * Channel targeting with string.
			 * @param {Message} msg Message invoking the targeting
			 * @param {String} thing Query
			 * @returns {TextChannel|null} Result
			 */
			getChannel: function (msg, thing) {
				let regexr = /^<#(\d{17,18})>$/.exec(thing) || /^(\d{17,18})$/.exec(thing)
				return regexr ? msg.guild.channels.get(regexr[1]) : null
			},
			/**
			 * Encapsulates strings in square brackets.
			 * @param {Array<String>} argStr Array of strings
			 * @returns {String} Result
			 */
			argSq: function (argStr) {
				let str = ''
				for (let aPos of argStr) {
					str += `[${aPos}] `
				}
				return str
			},
			/**
			 * Method for sanitising user input to prevent mentions.
			 * @param {String} text Input
			 * @returns {String} Sanitised output
			 */
			clean: function (text) {
				if (typeof (text) === 'string') return text.replace(/@/g, '@' + String.fromCharCode(8203))
				else return text
			},
			/**
			 * Gets invite codes from a string.
			 * @param {String} str1 Input
			 * @returns {Array<String>} Codes
			 */
			getInv: function (str1) {
				let reg = /(?:discordapp\.com\/invite|discord.gg)\/([a-zA-Z0-9\-]+)/g, array1, array2 = []
				while ((array1 = reg.exec(str1))) array2.push(array1[1])
				return array2
			},
			/**
			 * Check whether an invite code or URL is valid
			 * @param {string} code Code or URL of invite
			 * @returns {Boolean} Whether the invite is valid or not
			 */
			checkInv: async function (code) {
				return client.fetchInvite(code).then(()=>true).catch(()=>false)
			}
		}
		this.help = {
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
			aliases: new Enmap(),
			/**
			 * Rebuild the main help command reply embed, normally invoked after updating something in the commands map
			 */
			build: function () {
				this.fields = []
				this.aliases = new Enmap()
				let helpObj = {}
				for (let cat of Object.keys(this.cats)) {
					helpObj[cat] = {
						name: this.cats[cat],
						commands: []
					}
				}
				client.commands.map(function (a, b) {
					if (a.cat) helpObj[a.cat].commands.push(b)
					if (a.aliases) a.aliases.map(function(val) {
						client.help.aliases.set(val, b)
					})
				})
				let x = 0
				for (let i of Object.keys(helpObj)) {
					this.fields[x] = { name: helpObj[i].name, value: '' }
					for (let ii = 0; ii < helpObj[i].commands.length; ii++) {
						this.fields[x].value += '`' + helpObj[i].commands[ii] + '`'
						if (ii !== helpObj[i].commands.length - 1) this.fields[x].value += ', '
					}
					if (this.fields[x].value !== '') x++
				}
				if (this.fields[x] && this.fields[x].value === '') this.fields.pop()
			}
		}
		this.cd = {
			users: new Set(),
			/**
			 * Put a user in cooldown.
			 * @param {String} id ID of the user to be put in cooldown
			 * @param {Number} interval Amount of time in milliseconds to keep the user in cooldown
			 */
			addCooldown: function (id, interval = 1000) {
				this.users.add(id)
				client.setTimeout(function () {
					client.cd.users.delete(id)
				}, interval)
			},
			/**
			 * @param {String} thing User ID to be checked
			 * @returns {Boolean} Whether the user is in cooldown
			 */
			has: function (thing) {
				return this.users.has(thing)
			}
		}
		this.commands = new Enmap()
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
		this.data = {
			/**
			 * Stores per-guild data after cleaning it.
			 * @param {String} key Guild ID
			 * @param {Object} data Data object to be stored
			 */
			writeGuild: function (key, data) {
				for (let prop of Object.keys(data)) if ((data[prop] !== 0 || data[prop] !== false) && !data[prop] || (Array.isArray(data[prop]) && data[prop].length === 0)) delete data[prop]
				if (Object.keys(data).length === 0) this.guilds.delete(key)
				else this.guilds.set(key, data)
			},
			/**
			 * Stores per-user data after cleaning it.
			 * @param {String} key User ID
			 * @param {Object} data Data object to be stored
			 */
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
		this.on('ready', require('./events/ready.js'))
		this.on('error', function (err) {console.error(err)})
		this.on('warn', function (str) {console.warn(str)})
	}
}