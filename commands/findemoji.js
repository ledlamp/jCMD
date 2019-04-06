module.exports = {
	run: async function (msg, p) {
		let q = p[0]
		if (q.length < 3) throw new UserInputError('Your search query is too short! Make sure it is longer than 2 characters.')
		if (q.length > 32) throw new UserInputError('Your search query is too long! Make sure it is shorter than 32 characters.')
		let r = client.emojis.filter(function (e) {return e.name.includes(q)}).sort(function (a,b) {return a.name.indexOf(q) - b.name.indexOf(q)})
		if (r.size === 0) return {content: 'No emojis found.'}
		let a = [], x = 0
		for (let e of r) {
			if (x++ == 5) break
			a.push(e)
		}
		return {content: `Search results for **\`${client.util.clean(q)}\`**:\n` + a.map(function (n) {let e = n[1]; return e.toString() + ' *`' + e.name + '`*'}).join('\n')}
	},
	args: ['search query'], argCount: 1,
	cat: 'fun',
	desc: 'Find emojis across all servers the bot is in!',
	aliases: ['emoji']
}