module.exports = {
	run: async function (msg, p) {
		let usr = p.shift(), reason = p.join(' ') || 'No reason provided'
		return msg.guild.unban(usr, reason + ` - Requested by ${msg.author.tag}`)
		.then(user => {return {content: `**${user}** has been unbanned by **${msg.author.tag}** for: ${reason}.`}})
		.catch(error => {throw new UserInputError(`An error occured: ${error.message}`)})
	},
	cat: 'mod',
	reqGuild: true,
	perm: 'BAN_MEMBERS',
	botPerm: 'BAN_MEMBERS',
	args: ['mention/user ID'], argCount: 1,
	desc: 'Unbans the mentioned user/ID from this server.'
}
