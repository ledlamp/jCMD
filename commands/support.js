module.exports = {
	run: async function () {
		return { content: client.config.support }
	},
	cat: 'info',
	desc: 'Shows the invite to jCMD\'s official support server.'
}