module.exports = {
	run: async function () {
		return {
			content: client.config.invite
		}
	},
	cat: 'info',
	desc: 'Shows a link to invite the bot to your server.'
}