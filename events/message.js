let men = `<@${client.user.id}> `, menNick = `<@!${client.user.id}> `
module.exports = async function (msg) {
	if (msg.author.bot || msg.type !== 'DEFAULT') return
	let command, args, isDM = false, ment = (msg.channel.type !== 'dm' && msg.guild.me.nickname) ? menNick : men
	let cfg = msg.channel.type === 'dm' ? {prefix: ''} : client.data.guilds.get(msg.guild.id) || {}, prefix = cfg.prefix || client.config.prefix
	if (msg.channel.type === 'dm') {
		isDM = true
		args = msg.content.split(/ +/g)
	}
	else if (msg.content.startsWith(ment)) {
		args = msg.content.slice(ment.length).trim().split(/ +/g)
	}
	else if (msg.content.startsWith(prefix)) {
		args = msg.content.slice(prefix.length).trim().split(/ +/g)
	}
	else {
		if (cfg.invScan && cfg.invScan.includes(msg.channel.id)) {
			client.util.getInv(msg.content).map(function (code) {
				client.util.checkInv(code).then(function (bool) {
					if (!bool && msg.deletable) msg.delete().then(function () {
						if (cfg.invNoti) {
							let ch = cfg.invNoti === 'h' ? msg.channel : msg.guild.channels.get(cfg.invNoti)
							if (ch) ch.send(`${msg.author}, your message has been deleted for that it contains an invalid invite.`).catch(()=>undefined)
						}
					}).catch(()=>undefined)
				})
			})
		}
		return
	}
	command = args.shift()
	const cmdst = client.commands.get(command)
	if (!cmdst) return
	if (client.cd.has(msg.author.id)) return msg.channel.send('Slow down, take it easy.').catch(()=>undefined)
	function deepCmd(obj, p, his) {
		let noParse = false
		if (obj.own && (msg.author.id !== client.config.ownerID)) return client.util.throw(msg, client.lang.paste())
		if (obj.reqGuild && isDM) return client.util.throw(msg, 'You can only do that command in a server text channel.')
		if (obj.nsfw && !msg.channel.nsfw) return client.util.throw(msg, 'You can only do that command in a NSFW channel.')
		if (obj.args && (p.length < obj.args.length)) noParse = true
		if (!noParse && obj.perm && !msg.channel.permissionsFor(msg.member).has(obj.perm)) return client.util.throw(msg, 'Insufficient permissions. You are missing at least one of: `' + client.util.permName(obj.perm) + '`.')
		if (obj.botPerm && !msg.channel.permissionsFor(msg.guild.member(client.user)).has(obj.perm)) return client.util.throw(msg, 'Insufficient permissions for the bot. The bot is missing at least one of: `' + client.util.permName(obj.botPerm) + '`.')
		if (obj.run) {
			if (noParse) {
				if (!obj.noParse) return client.util.throw(msg, 'Not enough arguments. Arguments needed: ' + client.util.argSq(obj.args))
				else return obj.noParse(msg)
				.then (function (resp) {
					if (resp && (resp.content || resp.options))
					client.util.done(msg, resp.content, resp.options)
				})
				.catch (function (err) {
					if (err instanceof UserInputError) client.util.throw(msg, err.toString())
					else {
						client.users.get(client.config.ownerID).send(`UNEXPECTED ERROR OCCURED\nMESSAGE CONTENT:\n\`\`\`${msg.content}\`\`\`\nCOMMAND EXECUTED: \`${his}\`\nERROR:\n\`\`\`${util.inspect(err)}\`\`\``)
						client.util.throw(msg, 'Ouch! jCMD has encountered an unexpected error, and it has been automatically reported to the bot developer. Thank you for your cooperation!')
					}
				})
			}
			obj.run(msg, args)
			.then (function (resp) {
				if (resp && (resp.content || resp.options))
				client.util.done(msg, resp.content, resp.options)
			})
			.catch (function (err) {
				if (err instanceof UserInputError) client.util.throw(msg, err.toString())
				else {
					client.users.get(client.config.ownerID).send(`UNEXPECTED ERROR OCCURED\nMESSAGE CONTENT: \`\`\`${msg.content}\`\`\`\nCOMMAND EXECUTED: \`${his}\`\nERROR:\n\`\`\`${util.inspect(err)}\`\`\``)
					client.util.throw(msg, 'Ouch! jCMD has encountered an unexpected error, and it has been automatically reported to the bot developer. Thank you for your cooperation!')
				}
			})
			if(msg.author.id !== client.config.ownerID) client.cd.addCooldown(msg.author.id, obj.cd)
		}
		else {
			if (!p[0]) return client.commands.get('help').run(msg, his.split(' ')).then(({content, options}) => client.util.done(msg, content, options))
			let subc = p.shift()
			let clip = subc.length > 15 ? subc.slice(0, 15) + '...' : subc // Prevent user from entering long subcommands and making the bot spam
			if (Object.keys(obj.subCmd).indexOf(subc) == -1) return client.util.throw(msg, `Invalid subcommand \`${clip}\`. Do \`${prefix}help ${his}\` for more information.`)
			deepCmd(obj.subCmd[subc], p, his + ' ' + subc)
		}
	}
	deepCmd(cmdst, args, command)
}
