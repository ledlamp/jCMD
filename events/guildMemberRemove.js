module.exports = function (member) {
	let cf = client.data.guilds.get(member.guild.id)
	if (cf && cf.autoDel) cf.autoDel.map(function (id) {
		let ch = member.guild.channels.get(id)
		if (ch) ch.fetchMessages().then(function (messages) {
			ch.bulkDelete(messages.filter(function (message) {return message.author.id === member.user.id})).catch(()=>undefined)
		})
	})
}