exports.run = async function(client, msg, p) {
	let reason = p.slice(1).join(' ') || 'No reason provided.'
	msg.guild.unban(p[0])
		.then(user => client.q.cmdd(msg, `**${user.tag}** has been unbanned by **${msg.author.tag}** for: ${reason}`))
		.catch(error => client.q.cmdthr(msg, `An error occured: ${error.message}`))
}
exports.cat = 'mod'
exports.reqGuild = true
exports.perm = 'BAN_MEMBERS'
exports.botPerm = 'BAN_MEMBERS'
exports.args = ['mention/user ID']
exports.desc = 'Unbans the mentioned user/ID from this server.'
