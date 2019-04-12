module.exports = function (member) {
	let cf = client.data.guilds.get(member.guild.id)
	if (cf && cf.autoDel) cf.autoDel.map(function (id) {
		let ch = member.guild.channels.get(id)
		if (ch && ch.permissionsFor(ch.guild.me).has('MANAGE_MESSAGES')) {
			let fetched = [], x = 0, id = ''
			function fetcher () {
				ch.fetchMessages({before: id || undefined})
				.then(function (msgs) {
					let ls = msgs.last()
					if (!ls || x > 5) {
						return fetched.map(function (coll) {
							ch.bulkDelete(coll, true).catch(()=>undefined)
						})
					}
					else {
						x++
						fetched.push(msgs.filter(function (message) {return message.author.id === member.user.id}))
						id = ls.id
						fetcher()
					}
				})
			}
			fetcher()
		}
	})
}