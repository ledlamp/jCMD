module.exports = {
	run: async function (msg, p) {
		let member = client.util.getMember(msg, p.join(' '))
		if (member == null) throw new UserInputError('User not found. Check your spelling/mention/included ID and try again.')
		else {
			let user = member.user
			return {
				options: {embed: client.util.mkEmbed(undefined, `Profile picture of **${user.tag}**`, undefined, user.displayAvatarURL)}
			}
		}
	},
	noArgs: async function (msg) {
		let user = msg.author
		return {
			options: {embed: client.util.mkEmbed(user.tag, `Profile picture of **${user.tag}**`, undefined, user.displayAvatarURL)}
		}
	},
	noArgsDesc: 'Shows your own profile picture.' ,
	cat: 'util',
	args: ['user ID/mention/username/tag'], argCount: 1,
	desc: 'Gets the mentioned user\'s profile picture. You can only get profile pictures of people in this server, or the bot and yourself if this command is done in a DM channel.'
}