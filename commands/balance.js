module.exports = {
	run: async function (msg) {
		let d = (client.data.users.get(msg.author.id) || {}).bal
		return {content: `You have ${d || 0} credit${d === 1 ? '' : 's'}.`}
	},
	cat: 'fun',
	desc: 'Check how much ££££ ya got in yer pockets.',
	aliases: ['bal', 'money', 'credits']
}