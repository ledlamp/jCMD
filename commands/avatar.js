module.exports = {
	run: async function (msg, p) {
		let member = client.util.getMember(msg, p.join(' '))
		if (member == null) throw new UserInputError('User not found. Check your spelling/mention/included ID and try again.')
		else {
			let user = member.user
			return {
				options: {embed: client.util.mkEmbed(`Profile picture of **${user.tag}**`, undefined, undefined, user.displayAvatarURL)}
			}
		}
	},
	cat: 'util',
	cd: 3000,
	args: ['user ID/mention/username/tag'],
	desc: 'Gets the mentioned user\'s profile picture. You can only get profile pictures of people in this server, or the bot and yourself if this command is done in a DM channel.'
}