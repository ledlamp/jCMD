module.exports = {
	run: async function (msg) {
		return {content: `You have ${client.data.users.get(msg.author.id).bal || 0} credits.`}
	},
	cat: 'fun',
	desc: 'Check how much ££££ ya got in yer pockets.',
	aliases: ['bal', 'money', 'credits']
}