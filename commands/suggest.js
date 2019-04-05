module.exports = {
	run: async function (msg, args) {
		let ch = client.channels.get(client.config.suggestChID)
		return Promise(function (res, rej) {
			if (ch) ch.send(`\`\`\`${args.join(' ')}\`\`\`\nSuggested by **${msg.author.tag}**${msg.channel.type === 'text' ? ' in **' + msg.guild.name + '**' : ''}.`)
			.then(function () {
				res({content: 'Suggestion sent successfully.'})
			})
			.catch(function (e) {
				rej(e)
			})
		})
	},
	cat: 'info',
	cd: 3000,
	args: ['suggestions'],
	desc: 'Send suggestions or report abnormal bot behaviour to the bot developer using this command.',
	aliases: ['report']
}