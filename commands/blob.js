module.exports = {
	run: async function () {
		return {content: client.emojis.get('528847371782586368').toString()}
	},
	cat: 'fun',
	desc: 'Sends an extra hype blob emoji.',
	botPerm: 'USE_EXTERNAL_EMOJIS'
}