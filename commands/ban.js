module.exports = {
	run: async function (msg, p) {
		let usr = p.shift(), reason = p.join(' ') || 'No reason provided'
		const member = client.util.getMemberStrict(msg, usr)
		if (member) {
			if (msg.member.highestRole.comparePositionTo(member.highestRole) <= 0) throw new UserInputError('You do not have the ability to ban that user!')
			if (!member.bannable) throw new UserInputError('The bot isn\'t able to ban the user. Check the bot\'s permissions and whether the user has a role higher than the bot role.')
			return member.ban(reason + ` - Requested by ${msg.author.tag}`)
			.then(member => {return {content: `**${member.user.tag}** successfully banned by **${msg.author.tag}** for: ${reason}`}})
			.catch(error => (new UserInputError(`Couldn't ban ${member}. ${error}`)))
		}
		else return msg.guild.ban(usr, reason + ` - Requested by ${msg.author.tag}`)
		.then(one => {return {content: `**${one}** successfully banned by **${msg.author.tag}** for: ${reason}`}})
		.catch(error => {throw new UserInputError(`Couldn't ban ${member}. ${error}`)})
	},
	cat: 'mod',
	reqGuild: true,
	perm: 'BAN_MEMBERS',
	botPerm: 'BAN_MEMBERS',
	args: ['mention/user ID'], argCount: 1,
	desc: 'Bans the mentioned user/ID from this server.'
}