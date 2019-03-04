function deepHelp(msg, pre, object, p, his) {
	let own = false, reqGuild = false, nsfw = false
	function recHelp(obj, p, his) {
		if (obj.own) own = true
		if (obj.reqGuild) reqGuild = true
		if (obj.nsfw) nsfw = true
		if (obj.run) {
			let x = 0, pre = '', suf = '', fields = []
			if (obj.args) {
				fields[x] = { name: 'Usage', value: `${pre}${his} ${client.util.argSq(obj.args)}` }
				x++
			}
			if (obj.noParse) {
				fields[x] = { name: 'If no arguments are given...', value: obj.noParseDesc }
				x++
			}
			if (reqGuild) suf += ' This is a server-only command.'
			if (own) suf += ' ***Can only be executed by the bot owner.***'
			if (obj.cd) {
				let toSecs = parseFloat((obj.cd / 1000).toFixed(1))
				fields[x] = { name: 'Cooldown', value: `${toSecs} second${toSecs == 1 ? '' : 's'}` }
				x++
			}
			if (obj.perm) {
				fields[x] = { name: 'User permissions', value: client.util.permName(obj.perm) }
				x++
			}
			if (obj.botPerm) {
				fields[x] = { name: 'Bot permissions', value: client.util.permName(obj.botPerm) }
				x++
			}
			return client.util.mkEmbed(`❯ ${nsfw ? '[NSFW] ' : ''}Help on ` + pre + his, '❯ ' + pre + ' ' + obj.desc + ' ' + suf, fields)
		}
		else {
			let retv
			if (Object.keys(obj.subCmd).indexOf(p[0]) !== -1) {
				let fields = []
				for (let key = 0; key <= Object.keys(obj.subCmd).length - 1; key++) {
					let prop = Object.keys(obj.subCmd)[key]
					fields[key] = { name: prop, value: '' }
					if (obj.subCmd[prop].args) fields[key].value += client.util.argSq(obj.subCmd[prop].args)
					fields[key].value += obj.subCmd[prop].desc
				}
				retv = client.util.mkEmbed('❯ Help on ' + pre + his, '❯ ' + obj.desc + ' Subcommands:', fields)
			} else {
				let subc = p.shift()
				retv = recHelp(obj.subCmd[subc], p, his + ' ' + subc)
			}
			return retv
		}
	}
	return recHelp(object, p, his)
}

module.exports = {
	run: async function (msg, cmd) {
		let pr = client.util.getPre(msg)
		if (!cmd[0] || !client.commands.get(cmd[0])) return {
			options: {
				embed: client.util.mkEmbed(`❯ Prefix: ${pr === '' ? '(none in DMs)' : pr} - Help`, '❯ Available commands, by category:', client.help.fields)
			}
		}
		else {
			let c = cmd.shift()
			return {
				options: {
					embed: deepHelp(msg, pr, client.commands.get(c), cmd, c)
				}
			}
		}
	},
	cat: 'info',
	cd: 3000,
	desc: `Shows available commands or information about mentioned command.
	Somehow, this is one of the most complex commands ever written for this bot. Part of it even lies in the bot's main code file.`
}
