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
				let regexr = /^<@!?(\d{17,19})>$/.exec(thing) || /^(\d{17,18})$/.exec(thing)
				if (regexr) return msg.guild.members.get(regexr[1])
			},
			/**
			 * Channel targeting with string.
			 * @param {Message} msg Message invoking the targeting
			 * @param {String} thing Query
			 * @returns {TextChannel|null} Result
			 */
			getChannel: function (msg, thing) {
				let regexr = /^<#(\d{17,19})>$/.exec(thing) || /^(\d{17,18})$/.exec(thing)
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
				let array1, array2 = []
				while ((array1 = /(?:discordapp\.com\/invite|discord.gg)\/([a-zA-Z0-9\-]+)/g.exec(str1))) array2.push(array1[1])
				return array2
			},
			/**
			 * Gets the number of emojis a string.
			 * @param {String} str1 Input
			 * @returns {Number} Emoji count
			 */
			countEmojis: function (str) {
				return (str.match(/<?(a)?:?(\w{2,32}):(\d{17,19})>?/g) || []).length + (str.match(/\ud83d\udc68\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83d\udc68|\ud83d\udc68\u200d\ud83d\udc68\u200d\ud83d\udc66\u200d\ud83d\udc66|\ud83d\udc68\u200d\ud83d\udc68\u200d\ud83d\udc67\u200d\ud83d[\udc66\udc67]|\ud83d\udc68\u200d\ud83d\udc69\u200d\ud83d\udc66\u200d\ud83d\udc66|\ud83d\udc68\u200d\ud83d\udc69\u200d\ud83d\udc67\u200d\ud83d[\udc66\udc67]|\ud83d\udc69\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83d[\udc68\udc69]|\ud83d\udc69\u200d\ud83d\udc69\u200d\ud83d\udc66\u200d\ud83d\udc66|\ud83d\udc69\u200d\ud83d\udc69\u200d\ud83d\udc67\u200d\ud83d[\udc66\udc67]|\ud83d\udc68\u200d\u2764\ufe0f\u200d\ud83d\udc68|\ud83d\udc68\u200d\ud83d\udc68\u200d\ud83d[\udc66\udc67]|\ud83d\udc68\u200d\ud83d\udc69\u200d\ud83d[\udc66\udc67]|\ud83d\udc69\u200d\u2764\ufe0f\u200d\ud83d[\udc68\udc69]|\ud83d\udc69\u200d\ud83d\udc69\u200d\ud83d[\udc66\udc67]|\ud83c\udff3\ufe0f\u200d\ud83c\udf08|\ud83c\udff4\u200d\u2620\ufe0f|\ud83d\udc41\u200d\ud83d\udde8|(?:[\u0023\u002a\u0030-\u0039])\ufe0f?\u20e3|(?:(?:\ud83c\udfcb|\ud83d[\udd75\udd90]|[\u261d\u26f9\u270c\u270d])(?:\ufe0f|(?!\ufe0e))|\ud83c[\udf85\udfc2-\udfc4\udfc7\udfca]|\ud83d[\udc42\udc43\udc46-\udc50\udc66-\udc69\udc6e\udc70-\udc78\udc7c\udc81-\udc83\udc85-\udc87\udcaa\udd7a\udd95\udd96\ude45-\ude47\ude4b-\ude4f\udea3\udeb4-\udeb6\udec0]|\ud83e[\udd18-\udd1e\udd26\udd30\udd33-\udd39\udd3c-\udd3e]|[\u270a\u270b])(?:\ud83c[\udffb-\udfff]|)|\ud83c\udde6\ud83c[\udde8-\uddec\uddee\uddf1\uddf2\uddf4\uddf6-\uddfa\uddfc\uddfd\uddff]|\ud83c\udde7\ud83c[\udde6\udde7\udde9-\uddef\uddf1-\uddf4\uddf6-\uddf9\uddfb\uddfc\uddfe\uddff]|\ud83c\udde8\ud83c[\udde6\udde8\udde9\uddeb-\uddee\uddf0-\uddf5\uddf7\uddfa-\uddff]|\ud83c\udde9\ud83c[\uddea\uddec\uddef\uddf0\uddf2\uddf4\uddff]|\ud83c\uddea\ud83c[\udde6\udde8\uddea\uddec\udded\uddf7-\uddfa]|\ud83c\uddeb\ud83c[\uddee-\uddf0\uddf2\uddf4\uddf7]|\ud83c\uddec\ud83c[\udde6\udde7\udde9-\uddee\uddf1-\uddf3\uddf5-\uddfa\uddfc\uddfe]|\ud83c\udded\ud83c[\uddf0\uddf2\uddf3\uddf7\uddf9\uddfa]|\ud83c\uddee\ud83c[\udde8-\uddea\uddf1-\uddf4\uddf6-\uddf9]|\ud83c\uddef\ud83c[\uddea\uddf2\uddf4\uddf5]|\ud83c\uddf0\ud83c[\uddea\uddec-\uddee\uddf2\uddf3\uddf5\uddf7\uddfc\uddfe\uddff]|\ud83c\uddf1\ud83c[\udde6-\udde8\uddee\uddf0\uddf7-\uddfb\uddfe]|\ud83c\uddf2\ud83c[\udde6\udde8-\udded\uddf0-\uddff]|\ud83c\uddf3\ud83c[\udde6\udde8\uddea-\uddec\uddee\uddf1\uddf4\uddf5\uddf7\uddfa\uddff]|\ud83c\uddf4\ud83c\uddf2|\ud83c\uddf5\ud83c[\udde6\uddea-\udded\uddf0-\uddf3\uddf7-\uddf9\uddfc\uddfe]|\ud83c\uddf6\ud83c\udde6|\ud83c\uddf7\ud83c[\uddea\uddf4\uddf8\uddfa\uddfc]|\ud83c\uddf8\ud83c[\udde6-\uddea\uddec-\uddf4\uddf7-\uddf9\uddfb\uddfd-\uddff]|\ud83c\uddf9\ud83c[\udde6\udde8\udde9\uddeb-\udded\uddef-\uddf4\uddf7\uddf9\uddfb\uddfc\uddff]|\ud83c\uddfa\ud83c[\udde6\uddec\uddf2\uddf8\uddfe\uddff]|\ud83c\uddfb\ud83c[\udde6\udde8\uddea\uddec\uddee\uddf3\uddfa]|\ud83c\uddfc\ud83c[\uddeb\uddf8]|\ud83c\uddfd\ud83c\uddf0|\ud83c\uddfe\ud83c[\uddea\uddf9]|\ud83c\uddff\ud83c[\udde6\uddf2\uddfc]|\ud83c[\udccf\udd8e\udd91-\udd9a\udde6-\uddff\ude01\ude32-\ude36\ude38-\ude3a\ude50\ude51\udf00-\udf20\udf2d-\udf35\udf37-\udf7c\udf7e-\udf84\udf86-\udf93\udfa0-\udfc1\udfc5\udfc6\udfc8\udfc9\udfcf-\udfd3\udfe0-\udff0\udff4\udff8-\udfff]|\ud83d[\udc00-\udc3e\udc40\udc44\udc45\udc51-\udc65\udc6a-\udc6d\udc6f\udc79-\udc7b\udc7d-\udc80\udc84\udc88-\udca9\udcab-\udcfc\udcff-\udd3d\udd4b-\udd4e\udd50-\udd67\udda4\uddfb-\ude44\ude48-\ude4a\ude80-\udea2\udea4-\udeb3\udeb7-\udebf\udec1-\udec5\udecc\uded0-\uded2\udeeb\udeec\udef4-\udef6]|\ud83e[\udd10-\udd17\udd20-\udd25\udd27\udd3a\udd40-\udd45\udd47-\udd4b\udd50-\udd5e\udd80-\udd91\uddc0]|[\u23e9-\u23ec\u23f0\u23f3\u26ce\u2705\u2728\u274c\u274e\u2753-\u2755\u2795-\u2797\u27b0\u27bf\ue50a]|(?:\ud83c[\udc04\udd70\udd71\udd7e\udd7f\ude02\ude1a\ude2f\ude37\udf21\udf24-\udf2c\udf36\udf7d\udf96\udf97\udf99-\udf9b\udf9e\udf9f\udfcc-\udfce\udfd4-\udfdf\udff3\udff5\udff7]|\ud83d[\udc3f\udc41\udcfd\udd49\udd4a\udd6f\udd70\udd73\udd74\udd76-\udd79\udd87\udd8a-\udd8d\udda5\udda8\uddb1\uddb2\uddbc\uddc2-\uddc4\uddd1-\uddd3\udddc-\uddde\udde1\udde3\udde8\uddef\uddf3\uddfa\udecb\udecd-\udecf\udee0-\udee5\udee9\udef0\udef3]|[\u00a9\u00ae\u203c\u2049\u2122\u2139\u2194-\u2199\u21a9\u21aa\u231a\u231b\u2328\u23cf\u23ed-\u23ef\u23f1\u23f2\u23f8-\u23fa\u24c2\u25aa\u25ab\u25b6\u25c0\u25fb-\u25fe\u2600-\u2604\u260e\u2611\u2614\u2615\u2618\u2620\u2622\u2623\u2626\u262a\u262e\u262f\u2638-\u263a\u2648-\u2653\u2660\u2663\u2665\u2666\u2668\u267b\u267f\u2692-\u2694\u2696\u2697\u2699\u269b\u269c\u26a0\u26a1\u26aa\u26ab\u26b0\u26b1\u26bd\u26be\u26c4\u26c5\u26c8\u26cf\u26d1\u26d3\u26d4\u26e9\u26ea\u26f0-\u26f5\u26f7\u26f8\u26fa\u26fd\u2702\u2708\u2709\u270f\u2712\u2714\u2716\u271d\u2721\u2733\u2734\u2744\u2747\u2757\u2763\u2764\u27a1\u2934\u2935\u2b05-\u2b07\u2b1b\u2b1c\u2b50\u2b55\u3030\u303d\u3297\u3299])(?:\ufe0f|(?!\ufe0e))/g) || []).length
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
		this.cd = new Set()
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
				name: 'guilds',
				dataDir: './data'
			}),
			users: new Enmap({
				name: 'users',
				dataDir: './data'
			})
		}
		this.on('ready', require('./events/ready.js'))
		this.on('error', function (err) {console.error(err)})
		this.on('warn', function (str) {console.warn(str)})
	}
}