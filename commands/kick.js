module.exports = {
	run: async function (msg, p) {
		let usr = p.shift(), reason = p.join(' ') || 'No reason provided'
		const member = client.util.getMember(msg, usr)
		if (!member) throw new UserInputError('Mentioned member not valid or not in server.')
		if (msg.member.highestRole.comparePositionTo(member.highestRole) <= 0) throw new UserInputError('You do not have the ability to kick that user!')
		if (!member.kickable) throw new UserInputError('The bot isn\'t able to kick the user. Check the bot\'s permissions and whether the user has a higher role than the bot.')
		return member.kick(reason)
		.then(member => {return {content: `**${member.user.tag}** successfully kicked by **${msg.author.tag}** for: ${reason}`}})
		.catch(error => {throw new UserInputError(`Couldn't kick **${msg.author}**. Error: ${error.message}`)})
	},
	cat: 'mod',
	reqGuild: true,
	perm: 'KICK_MEMBERS',
	botPerm: 'KICK_MEMBERS',
	args: ['mention/user ID'],
	desc: 'Kicks the mentioned user/ID from this server.'
}