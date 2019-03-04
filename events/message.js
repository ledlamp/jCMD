let men = `<@${client.user.id}> `, menNick = `<@!${client.user.id}> `
module.exports = async function (msg) {
	if (msg.author.bot) return
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
			let codes = client.util.getInv(msg.content), del = false
			for (let code of codes) {
				let bool = await client.util.checkInv(code)
				if (!bool) {
					del = true
					break
				}
			}
			if (del && msg.deletable) msg.delete().catch(()=>undefined)
		}
		return
	}
	command = args.shift()
	const cmdst = client.commands.get(command)
	if (!cmdst) return
	if (client.cd.has(msg.author.id)) return msg.channel.send('Slow down, take it easy.').catch(()=>undefined)
	function deepCmd(obj, p, his) {
		if (obj.own && (msg.author.id !== client.config.ownerID)) return client.util.throw(msg, client.rnd.insultGet())
		if (obj.reqGuild && isDM) return client.util.throw(msg, 'You can only do that command in a server text channel.')
		if (obj.nsfw && !msg.channel.nsfw) return client.util.throw(msg, 'You can only do that command in a NSFW channel.')
		if (obj.run) {
			if (obj.args && (p.length < obj.args.length)) {
				if (!obj.noParse) return client.util.throw(msg, 'Not enough arguments. Arguments needed: ' + client.util.argSq(obj.args))
				else return obj.noParse(msg)
				.then (function (resp) {
					if (resp && (resp.content || resp.options))
					client.util.done(msg, resp.content, resp.options)
				})
				.catch (function (err) {
					if (err instanceof UserInputError) client.util.throw(msg, err.toString())
					else {
						client.users.get(client.config.ownerID).send(`UNEXPECTED ERROR OCCURED\nMESSAGE CONTENT: \`\`\`${msg.content}\`\`\`\nCOMMAND EXECUTED: \`${his}\`\nERROR:\`\`\`${util.inspect(err)}\`\`\``)
						client.util.throw(msg, 'Ouch! jCMD has encountered an unexpected error, and it has been automatically reported to the bot developer. Thank you for your cooperation!')
					}
				})
			}
			if (obj.perm && !msg.channel.permissionsFor(msg.member).has(obj.perm)) return client.util.throw(msg, 'Insufficient permissions. You are missing at least one of: `' + client.util.permName(obj.perm) + '`.')
			if (obj.botPerm && !msg.channel.permissionsFor(msg.guild.member(client.user)).has(obj.perm)) return client.util.throw(msg, 'Insufficient permissions for the bot. The bot is missing at least one of: `' + client.util.permName(obj.botPerm) + '`.')
			obj.run(msg, args)
			.then (function (resp) {
				if (resp && (resp.content || resp.options))
				client.util.done(msg, resp.content, resp.options)
			})
			.catch (function (err) {
				if (err instanceof UserInputError) client.util.throw(msg, err.toString())
				else {
					client.users.get(client.config.ownerID).send(`UNEXPECTED ERROR OCCURED\nMESSAGE CONTENT: \`\`\`${msg.content}\`\`\`\nCOMMAND EXECUTED: \`${his}\`\nERROR:\`\`\`${util.inspect(err)}\`\`\``)
					client.util.throw(msg, 'Ouch! jCMD has encountered an unexpected error, and it has been automatically reported to the bot developer. Thank you for your cooperation!')
				}
			})
			if(msg.author.id !== client.config.ownerID) client.cd.addCooldown(msg.author.id, obj.cd)
		}
		else {
			if (!p[0]) return client.util.throw(msg, `You need to define a subcommand. Do \`${prefix}help ${his}\` for more information.`)
			let subc = p.shift()
			let clip = subc.length > 15 ? subc.slice(0, 15) + '...' : subc // Prevent user from entering long subcommands and making the bot spam
			if (Object.keys(obj.subCmd).indexOf(subc) == -1) return client.util.throw(msg, `Invalid subcommand \`${clip}\`. Do \`${prefix}help ${his}\` for more information.`)
			deepCmd(obj.subCmd[subc], p, his + ' ' + subc)
		}
	}
	deepCmd(cmdst, args, command)
}
