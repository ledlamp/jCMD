module.exports = {
	run: async function(msg, p) {
		let user
		if (p[0] && p[0].toLowerCase() === 'true') user = client.user
		else user = msg.member.user
		let permlist = `All permissions for **${user.tag}** and their states: \n\`\`\`md\n`
		for (let i = 0; i < client.lang.perms.length; i++) {
			permlist += (msg.channel.permissionsFor(user).has(client.lang.perms[i], false) ? '#  TRUE | ' : '> FALSE | ') + client.lang.permnames[i]
			if (i !== client.lang.perms.length - 1) permlist += '\n'
			else permlist += '```'
		}
		return {content: permlist}
	},
	cat: 'util',
	reqGuild: 'true',
	desc: 'Shows all user permissions, or you can pass `true` to see bot permissions. This command is quite useful for setting up the bot.'
}