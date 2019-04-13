function deepHelp(pre, object, p, his) {
	let own = false, reqGuild = false, nsfw = false
	function recHelp(obj, p, his) {
		if (obj.own) own = true
		if (obj.reqGuild) reqGuild = true
		if (obj.nsfw) nsfw = true
		if (obj.run) {
			let x = 0, suf = '', fields = []
			if (obj.args) fields[x++] = { name: 'Usage', value: `${pre}${his} ${client.util.argSq(obj.args)}` }
			if (obj.noArgs) fields[x++] = { name: 'If no arguments are given...', value: obj.noArgsDesc }
			if (reqGuild) suf += ' This is a server-only command.'
			if (own) suf += ' ***Can only be executed by the bot owner.***'
			if (obj.aliases) fields[x++] = { name: 'Aliases', value: obj.aliases.map(c => `\`${c}\``).join(', ') }
			if (obj.cd) {
				let toSecs = parseFloat((obj.cd / 1000).toFixed(1))
				fields[x++] = { name: 'Cooldown', value: `${toSecs} second${toSecs === 1 ? '' : 's'}` }
			}
			if (obj.perm) fields[x++] = { name: 'User permissions', value: client.util.permName(obj.perm) }
			if (obj.botPerm) fields[x] = { name: 'Bot permissions', value: client.util.permName(obj.botPerm) }
			return client.util.mkEmbed(`❯ ${nsfw ? '[NSFW] ' : ''}Help on ` + pre + his, obj.desc + suf, fields)
		}
		else {
			let retv, k = Object.keys(obj.subCmd), subc = p.shift()
			if (!k.includes(subc)) {
				let fields = []
				for (let key = 0; key <= k.length - 1; key++) {
					let prop = k[key]
					fields[key] = { name: prop, value: '' }
					if (obj.subCmd[prop].args) fields[key].value += client.util.argSq(obj.subCmd[prop].args)
					fields[key].value += obj.subCmd[prop].desc
				}
				retv = client.util.mkEmbed('❯ Help on ' + pre + his, obj.desc + ' Subcommands:', fields)
			} else {
				retv = recHelp(obj.subCmd[subc], p, his + ' ' + subc)
			}
			return retv
		}
	}
	return recHelp(object, p, his)
}

module.exports = {
	run: async function (msg, cmd) {
		let pr = client.util.getPre(msg), obj = client.commands.get(cmd[0]) || client.commands.get(client.help.aliases.get(cmd[0]))
		if (!cmd[0] || !obj) return {
			options: {
				embed: client.util.mkEmbed(`❯ Prefix: ${pr === '' ? '(none in DMs)' : pr} - Help`, '❯ Available commands, by category:', client.help.fields)
			}
		}
		else {
			let c = cmd.shift(), trC = client.help.aliases.get(c)
			return {
				options: {
					embed: deepHelp(pr, obj, cmd, trC || c)
				}
			}
		}
	},
	cat: 'info',
	desc: 'Shows available commands or information about mentioned command.\nSomehow, this is one of the most complex commands ever written for this bot. Part of it even lies in the bot\'s main code file.',
	args: ['command name', '?...subcommands'], argCount: 0,
	aliases: ['h']
}