module.exports = async function (msg) {
	let args, isDM = msg.channel.type === 'dm', ment = isDM ? undefined : msg.guild.me.toString() + ' ', myperms = isDM ? undefined : msg.channel.permissionsFor(msg.guild.me), cfg = isDM ? {prefix: ''} : client.data.guilds.get(msg.guild.id) || {}, prefix = isDM ? '' : (cfg.prefix || client.config.prefix)
	if (msg.author.bot || msg.type !== 'DEFAULT' || (!isDM && !myperms.has('SEND_MESSAGES'))) return
	if (isDM) args = msg.content.split(/ +/g)
	else if (msg.content.startsWith(ment)) args = msg.content.slice(ment.length).trim().split(/ +/g)
	else if (msg.content.toLowerCase().startsWith(prefix)) args = msg.content.slice(prefix.length).trim().split(/ +/g)
	else {
		if (cfg.invScan && cfg.invScan.includes(msg.channel.id)) client.util.getInv(msg.content).map(function (code) {
			client.util.checkInv(code).then(function (bool) {
				if (!bool && msg.deletable) msg.delete().then(function () {
					if (cfg.invNoti) {
						let ch = cfg.invNoti === 'h' ? msg.channel : msg.guild.channels.get(cfg.invNoti)
						if (ch) ch.send(`${msg.author}, your message has been deleted for that it contains an invalid invite.`).catch(()=>undefined)
					}
				}).catch(()=>undefined)
			})
		})
		return
	}
	let command = args.shift().toLowerCase()
	const cmdst = client.commands.get(command) || client.commands.get(client.help.aliases.get(command))
	if (!cmdst) return
	if (client.cd.has(msg.author.id)) return msg.channel.send('Slow down, take it easy.').then(function (m) {
		client.setTimeout(function () {m.delete().catch(()=>undefined)}, 1500)
	}).catch(()=>undefined)
	function deepCmd(obj, p, his) {
		function deller (m) {
			if (!m) return
			function f (del) {
				if (del.id === msg.id) {
					client.off('messageDelete', f)
					client.clearTimeout(t)
					m.delete().catch(()=>undefined)
				}
			}
			let t = client.setTimeout(function () {
				client.off('messageDelete', f)
			}, 10000)
			client.on('messageDelete', f)
		}
		let noParse = obj.args && (p.length < obj.args.length)
		if (obj.own && (msg.author.id !== client.config.ownerID)) return client.util.throw(msg, client.lang.paste()).then(deller)
		if (obj.reqGuild && isDM) return client.util.throw(msg, 'You can only do that command in a server text channel.').then(deller)
		if (obj.nsfw && !msg.channel.nsfw) return client.util.throw(msg, 'You can only do that command in a NSFW channel.').then(deller)
		if (!isDM && (msg.author.id !== client.config.ownerID) && !noParse && obj.perm && !msg.channel.permissionsFor(msg.member).has(obj.perm)) return client.util.throw(msg, 'Insufficient permissions. You are missing at least one of: `' + client.util.permName(obj.perm) + '`.').then(deller)
		if (!isDM && obj.botPerm && !myperms.has(obj.botPerm)) return client.util.throw(msg, 'Insufficient permissions for the bot. The bot is missing at least one of: `' + client.util.permName(obj.botPerm) + '`.').then(deller)
		if (obj.run) {
			if (noParse) {
				if (!obj.noParse) return client.util.throw(msg, 'Not enough arguments. Arguments needed: ' + client.util.argSq(obj.args)).then(deller)
				else return obj.noParse(msg)
				.then (function (resp) {
					if (resp && (resp.content || resp.options))
						client.util.done(msg, resp.content, resp.options).then(deller)
				})
				.catch (function (err) {
					if (err instanceof UserInputError) client.util.throw(msg, err.toString()).then(deller)
					else {
						client.users.get(client.config.ownerID).send(`UNEXPECTED ERROR OCCURED\nMESSAGE CONTENT:\n\`\`\`${msg.content}\`\`\`\nCOMMAND EXECUTED: \`${his}\`\nERROR:\n\`\`\`${util.inspect(err)}\`\`\``)
						client.util.throw(msg, 'Ouch! jCMD has encountered an unexpected error, and it has been automatically reported to the bot developer. Thank you for your cooperation!').then(deller)
					}
				})
			}
			obj.run(msg, args)
			.then (function (resp) {
				if (resp && (resp.content || resp.options)) client.util.done(msg, resp.content, resp.options).then(deller)
			})
			.catch (function (err) {
				if (err instanceof UserInputError) client.util.throw(msg, err.toString()).then(deller)
				else {
					client.users.get(client.config.ownerID).send(`UNEXPECTED ERROR OCCURED\nMESSAGE CONTENT: \`\`\`${msg.content}\`\`\`\nCOMMAND EXECUTED: \`${his}\`\nERROR:\n\`\`\`${util.inspect(err)}\`\`\``)
					client.util.throw(msg, 'Ouch! jCMD has encountered an unexpected error, and it has been automatically reported to the bot developer. Thank you for your cooperation!').then(deller)
				}
			})
			if (msg.author.id !== client.config.ownerID) client.cd.addCooldown(msg.author.id, obj.cd)
		}
		else {
			if (!p[0]) return client.commands.get('help').run(msg, his.split(' ')).then(function (rep) {
				client.util.done(msg, rep.content, rep.options).then(deller)
			})
			let subc = p.shift()
			let clip = subc.length > 15 ? subc.slice(0, 15) + '...' : subc // Prevent user from entering long subcommands and making the bot spam
			if (!Object.keys(obj.subCmd).includes(subc)) return client.commands.get('help').run(msg, his.split(' ')).then(function (rep) {
				client.util.throw(msg, `The subcommand \`${clip}\` does not exist. Here's some more information on \`${prefix + his}\`.`, rep.options).then(deller)
			})
			deepCmd(obj.subCmd[subc], p, his + ' ' + subc)
		}
	}
	deepCmd(cmdst, args, command)
}