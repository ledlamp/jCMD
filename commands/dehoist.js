const hoistChars = [ '!','$','%','^','&','*','(',')','_','+','|','~','-','=','`','{','}','[',']',':','"',';',"'",'<','>','?',',','.','/' ]
module.exports = {
	run: async function (msg, p) {
		msg.channel.startTyping()
		let renick = p.join(' '), su = 0, fa = 0
		if (renick.length > 32) throw new UserInputError('Specified nickname is too long. The maximum length for a Discord nickname is 32 characters.')
		return Promise.all(msg.guild.members.map(function (member) {
			let l = (member.nickname || member.user.username).substring(0, 1)
			if (msg.guild.me.highestRole.comparePositionTo(member.highestRole) > 0 && hoistChars.includes(l)) return member.setNickname(renick, `Dehoist - Requested by ${msg.author.tag}`)
			.then(()=>{su++; return Promise.resolve()})
			.catch(()=>{fa++; return Promise.resolve()})
		})).then(function () {
			msg.channel.stopTyping()
			return {
				content: `Dehoisting process complete!\nSuccessful renames: **${su}**\nFailed renames: **${fa}**`
			}
		})
	},
	cat: 'mod',
	desc: 'Dehoists members.',
	args: ['new nickname for dehoisted members'],
	reqGuild: true,
	perm: 'MANAGE_NICKNAMES',
	botPerm: 'MANAGE_NICKNAMES',
	cd: 3000
}