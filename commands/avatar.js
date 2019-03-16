module.exports = {
	run: async function (msg, p) {
		client
		let member = client.util.getMember(msg, p.join(' '))
		if (member == null) throw new UserInputError('User not found. Check your spelling/mention/included ID and try again.')
		else {
			let user = member.user
			return {
				options: {embed: client.util.mkEmbed(user.tag, `Profile picture of **${user.tag}**`, undefined, user.displayAvatarURL)}
			}
		}
	},
	noParse: async function (msg) {
		let user = msg.author
		return {
			options: {embed: client.util.mkEmbed(user.tag, `Profile picture of **${user.tag}**`, undefined, user.displayAvatarURL)}
		}
	},
	noParseDesc: 'Shows your own profile picture.' ,
	cat: 'util',
	cd: 3000,
	args: ['user ID/mention/username/tag'],
	desc: 'Gets the mentioned user\'s profile picture. You can only get profile pictures of people in this server, or the bot and yourself if this command is done in a DM channel.'
}