exports.run = async function(client, msg, p) {
	let reason = p.slice(1).join(' ')
	if (!reason) reason = 'No reason provided.'
	const member = msg.mentions.members.first() || msg.guild.members.get(p[0])
	if (member) {
		if (msg.member.highestRole.comparePositionTo(member.highestRole) <= 0) return client.q.cmdthr(msg, 'You do not have the ability to ban that user!')
		if (!member.bannable) return client.q.cmdthr(msg, 'The bot isn\'t able to ban the user. Check the bot\'s permissions and whether the user has a role higher than the bot role.')
		await member.ban(reason)
			.catch(error => client.q.cmdthr(msg, `Couldn't ban ${member}. Error: ${error}`))
		client.q.cmdd(msg, `**${member.user.tag}** successfully banned by **${msg.author.tag}** for: ${reason}`)
	} else msg.guild.ban(p[0], {
		reason: reason
	})
		.then(user => client.q.cmdd(msg, `**${user.tag}** succesfully banned by **${msg.author.tag}** for: ${reason}`))
		.catch(error => client.q.cmdthr(msg, `Something went wrong: ${error.message}`))
}
exports.cat = 'mod'
exports.reqGuild = true
exports.perm = 'BAN_MEMBERS'
exports.botPerm = 'BAN_MEMBERS'
exports.args = ['mention/user ID']
exports.desc = 'Bans the mentioned user/ID from this server.'
