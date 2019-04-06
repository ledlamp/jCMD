module.exports = {
	run: async function (msg, p) {
		let usr = p.shift(), reason = p.join(' ') || 'No reason provided'
		const member = client.util.getMemberStrict(msg, usr)
		if (member) {
			if (msg.member.highestRole.comparePositionTo(member.highestRole) <= 0) throw new UserInputError('You do not have the ability to ban that user!')
			if (!member.bannable) throw new UserInputError('The bot isn\'t able to ban the user. Check the bot\'s permissions and whether the user has a role higher than the bot role.')
			return member.ban({days: 7, reason: reason + ` - Requested by ${msg.author.tag}`})
			.then(member => msg.guild.unban(member))
			.then(member => {return {content: `**${member.user.tag}** successfully softbanned by **${msg.author.tag}** for: ${reason}`}})
			.catch(error => (new UserInputError(`Couldn't softban ${member}. ${error}`)))
		}
		else throw new UserInputError('Mentioned member not valid or not in server.')
	},
	cat: 'mod',
	reqGuild: true,
	perm: 'BAN_MEMBERS',
	botPerm: 'BAN_MEMBERS',
	args: ['mention/user ID'], argCount: 1,
	desc: 'Bans the mentioned user/ID from this server then unbans them, just for the sake of flushing away all their messages.'
}