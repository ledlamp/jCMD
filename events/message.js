// Hotfix for a bug in Discord Android (https://trello.com/c/lkRVWaAw)
const ment = `<@${client.user.id}>`
const mentn = `<!@${client.user.id}>`
function handler (msg, respr, thr) {
	let
	args, // Argument array, this will be defined later when the message is processed
	isDM = msg.channel.type === 'dm', // Whether the message is a DM message
	myperms = isDM ? undefined : msg.channel.permissionsFor(msg.guild.me), // Permissions for the client in the message's channel
	cfg = isDM ? {prefix: ''} : client.data.guilds.get(msg.guild.id) || {}, // The config entry for the message's guild (only outside of DMs)
	prefix = cfg.prefix || client.config.prefix // Supposed prefix for the message if it contains a command

	// Ignore all bots, all non-normal messages, and all channels where the client user cannot send messages
	if (msg.author.bot || msg.type !== 'DEFAULT' || (!isDM && !myperms.has('SEND_MESSAGES'))) return

	// In this part, we will split the message by space characters and assign the array to binding `args`

	// If the message is a DM message, treat it as if it has no prefix
	if (isDM) args = msg.content.split(/ +/g)

	// Else, see if it starts by mentioning the client user
	// Note that there are two lines for this because of a bug in Discord Android. See top of this file.
	else if (msg.content.startsWith(ment)) args = msg.content.slice(ment.length).trim().split(/ +/g)
	else if (msg.content.startsWith(mentn)) args = msg.content.slice(mentn.length).trim().split(/ +/g)

	// Else, see if it starts with the supposed prefix
	else if (msg.content.startsWith(prefix)) args = msg.content.slice(prefix.length).trim().split(/ +/g)

	// Else, commence automatic moderation.
	else {
		let d = false // This boolean expresses whether a message is deleted yet

		// If the guild & channel is configured to be scanned for invalid invites, get all invites within the message and check all of them
		if (cfg.invScan && cfg.invScan.includes(msg.channel.id)) client.util.getInv(msg.content).map(function (code) {
			if (d) return
			// See if this invite is valid
			client.util.checkInv(code).then(function (bool) {
				// If it's not and that the message can be deleted, delete it
				if (!bool && msg.deletable) {
					d = true
					msg.delete().then(function () {
						// Notify the user if is configured to do so
						if (cfg.invNoti) {
							let ch = cfg.invNoti === 'h' ? msg.channel : msg.guild.channels.get(cfg.invNoti)
							if (ch) ch.send(`${msg.author}, your message has been deleted for that it contains an invalid invite.`).catch(()=>undefined)
						}
					}).catch(()=>undefined)
				}
			})
		})

		// If the guild & channel is configured to be scanned for emojis, count all emojis in this message and compare it against the limit
		if (!d && cfg.emjLim && cfg.emjChs && cfg.emjChs.includes(msg.channel.id) && msg.deletable) {
			let c = client.util.countEmojis(msg.content)
			if (c > cfg.emjLim) msg.delete().then(function () {
				// Delete the message and notify the user
				d = true
				return msg.channel.send(`${msg.author}, your message has been deleted for that it contains more emojis than allowed. (**${c}** > **${cfg.emjLim}**)`)
			})
			.then(function (m) {
				// Self cleanup after notifying the user
				setTimeout(function () {
					m.delete().catch(()=>undefined)
				}, 5000)
			})
			.catch(()=>undefined)
		}
		return
	}
	let command = args.shift().toLowerCase()
	const cmdst = client.commands.get(command) || client.commands.get(client.help.aliases.get(command))
	if (!cmdst) return
	if (client.cd.has(msg.author.id)) return msg.channel.send('Slow down, take it easy.').then(function (m) {
		client.setTimeout(function () {m.delete().catch(()=>undefined)}, 1500)
	}).catch(()=>undefined)
	function deepCmd(obj, p, his) {
		let noArgs = obj.argCount && obj.noArgs && (p.length === 0)
		if (obj.own && (msg.author.id !== client.config.ownerID)) return thr(client.lang.paste())
		if (obj.reqGuild && isDM) return thr('You can only do that command in a server text channel.')
		if (obj.nsfw && !msg.channel.nsfw) return thr('You can only do that command in a NSFW channel.')
		if (!isDM && (msg.author.id !== client.config.ownerID) && !noArgs && obj.perm && !msg.channel.permissionsFor(msg.member).has(obj.perm)) return thr('Insufficient permissions. You are missing at least one of: `' + client.util.permName(obj.perm) + '`.')
		if (!isDM && obj.botPerm && !myperms.has(obj.botPerm)) return thr('Insufficient permissions for the bot. The bot is missing at least one of: `' + client.util.permName(obj.botPerm) + '`.')
		if (!noArgs && (p.length < obj.argCount)) return thr('Not enough arguments. Arguments needed: ' + client.util.argSq(obj.args))
		if (obj.run) {
			if (noArgs) {
				if (msg.author.id !== client.config.ownerID) client.cd.add(msg.author.id)
				obj.noArgs(msg)
				.then(function (resp) {
					client.setTimeout(function () {
						client.cd.delete(msg.author.id)
					}, obj.cd || 1000)
					if (resp && (resp.content || resp.options)) respr(resp.content, resp.options, resp.traces)
				})
				.catch(function (err) {
					client.setTimeout(function () {
						client.cd.delete(msg.author.id)
					}, obj.cd || 1000)
					if (err instanceof UserInputError) thr(err.toString())
					else {
						client.users.get(client.config.ownerID).send(`UNEXPECTED ERROR OCCURED\nMESSAGE CONTENT:\n\`\`\`${msg.content}\`\`\`\nCOMMAND EXECUTED: \`${his}\`\nERROR:\n\`\`\`${util.inspect(err)}\`\`\``)
						thr('Ouch! jCMD has encountered an unexpected error, and it has been automatically reported to the bot developer. Thank you for your cooperation!')
					}
				})
				return
			}
			if (msg.author.id !== client.config.ownerID) client.cd.add(msg.author.id)
			obj.run(msg, args)
			.then(function (resp) {
				client.setTimeout(function () {
					client.cd.delete(msg.author.id)
				}, obj.cd || 1000)
				if (resp && (resp.content || resp.options)) respr(resp.content, resp.options, resp.traces)
			})
			.catch(function (err) {
				client.setTimeout(function () {
					client.cd.delete(msg.author.id)
				}, obj.cd || 1000)
				if (err instanceof UserInputError) thr(err.toString())
				else {
					client.users.get(client.config.ownerID).send(`UNEXPECTED ERROR OCCURED\nMESSAGE CONTENT: \`\`\`${msg.content}\`\`\`\nCOMMAND EXECUTED: \`${his}\`\nERROR:\n\`\`\`${util.inspect(err)}\`\`\``)
					thr('Ouch! jCMD has encountered an unexpected error, and it has been automatically reported to the bot developer. Thank you for your cooperation!')
				}
			})
		}
		// Else, take the next word of the message and see if a subcommand with the same name exists
		else {
			// Show help for the subcommand if no more subcommands are specified
			if (!p[0]) return client.commands.get('help').run(msg, his.split(' ')).then(function (rep) {
				respr(rep.content, rep.options, rep.traces)
			})
			let subc = p.shift().toLowerCase()
			let clip = subc.length > 15 ? subc.slice(0, 15) + '...' : subc // Prevent user from entering long subcommands and making the bot spam
			// Give user the furthest info down the command tree possible if a specified subcommand does not exist
			if (!obj.subCmd.hasOwnProperty(subc)) return client.commands.get('help').run(msg, his.split(' ')).then(function (rep) {
				thr(`The subcommand \`${clip}\` does not exist. Here's some more information on \`${prefix + his}\`.`, rep.options)
			})
			// Call self to keep going down the command tree
			deepCmd(obj.subCmd[subc], p, his + ' ' + subc)
		}
	}
	// Start
	deepCmd(cmdst, args, command)
}

module.exports = async function (msg) {
	function deller (m, x, tr) {
		let t = client.setTimeout(function () {
			client.off('messageDelete', f)
			client.off('messageUpdate', e)
			client.off('message', s)
		}, 30000)

		if (!m || x > 5) {
			client.off('messageDelete', f)
			client.off('messageUpdate', e)
			client.off('message', s)
			client.clearTimeout(t)
			return
		}

		function f (del) {
			if (del.id === msg.id) {
				client.off('messageDelete', f)
				client.off('messageUpdate', e)
				client.off('message', s)
				client.clearTimeout(t)
				if (tr) tr.map(function (d) {
					if (d.deletable) d.delete().catch(()=>undefined)
				})
				m.delete().catch(()=>undefined)
			}
		}

		function e (o, n) {
			if (o.id === msg.id) {
				client.off('messageDelete', f)
				client.off('messageUpdate', e)
				client.off('message', s)
				client.clearTimeout(t)
				if (tr) tr.map(function (d) {
					if (d.deletable) d.delete().catch(()=>undefined)
				})
				let rs = n.reactions.filter(function (r) {
					return r.me
				})
				Promise.all(rs.map(function (r) {
					return r.remove().then(function() {return Promise.resolve()}).catch(function() {return Promise.resolve()})
				}))
				.then(function () {
					handler(n, function(c, o) {
						m.edit(c, o).then(function () {
							deller(m, ++x)
						})
					}, function (c, o) {
						n.react('❌').catch(console.log)
						m.edit(c, o).then(function () {
							deller(m, ++x)
						})
					})
				})
			}
		}

		function s (m) {
			if (m.author.id === msg.author.id) {
				client.off('messageDelete', f)
				client.off('messageUpdate', e)
				client.off('message', s)
				client.clearTimeout(t)
			}
		}
		
		client.on('messageDelete', f)
		client.on('messageUpdate', e)
		client.on('message', s)
	}
	handler(msg, function(c, o, tr) {
		client.util.done(msg, c, o).then(function (m) {
			deller(m, 0, tr)
		})
	}, function (c, o) {
		client.util.throw(msg, c, o).then(function (m) {
			deller(m, 0)
		})
	})
}