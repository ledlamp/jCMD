exports.run = async function(client, msg, p) {
	let member = msg.mentions.members.first() || msg.guild.members.get(p[0])
	if (msg.member.highestRole.comparePositionTo(member.highestRole) <= 0) return client.q.cmdthr(msg, 'You do not have the ability to kick that user!')
	if (!member) return client.q.cmdthr(msg, 'Mentioned member not valid or not in server.')
	if (!member.kickable) return client.q.cmdthr(msg, 'Kick unsuccessful. Check the bot\'s permissions and whether the user has a higher role than the bot.')
	let reason = p.slice(1).join(' ')
	if (!reason) reason = 'No reason provided.'
	await member.kick(reason)
		.catch(error => client.q.cmdthr(msg, `Couldn't kick **${msg.author}**. Error: ${error.message}`))
	client.q.cmdd(msg, `**${member.user.tag}** successfully kicked by **${msg.author.tag}** for: ${reason}`)
}
exports.cat = 'mod'
exports.reqGuild = true
exports.perm = 'KICK_MEMBERS'
exports.botPerm = 'KICK_MEMBERS'
exports.args = ['mention/user ID']
exports.desc = 'Kicks the mentioned user/ID from this server.'
