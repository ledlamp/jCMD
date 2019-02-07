exports.run = async function(client, msg, p) {
	let user
	if (p && (/true/i).test(p[0])) user = client.user
	else user = msg.member.user
	let permlist = `All permissions for **${user.tag}** and their states: \n\`\`\`md\n`
	for (let i = 0; i < client.perms.PERMS.length; i++) {
		if (msg.channel.permissionsFor(user).has(client.perms.PERMS[i], false)) permlist += '#  TRUE | '
		else permlist += '> FALSE | '
		permlist += client.perms.PERMNAMES[i]
		if (i != client.perms.PERMS.length - 1) permlist += '\n'
		else permlist += '```'
	}
	msg.channel.send(permlist).catch(()=>{})
}
exports.cat = 'util'
exports.reqGuild = true
exports.desc = 'Shows all user permissions, or you can parse `true` to see bot permissions. This command is quite useful for setting up the bot.'
