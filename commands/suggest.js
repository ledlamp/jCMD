module.exports = {
	run: async function (msg, args) {
		let ch = client.channels.get(client.config.suggestChID)
		if (ch) ch.send(`\`\`\`${args.join(' ')}\`\`\`\nSuggested by **${msg.author.tag}**${msg.channel.type === 'text' ? ' in **' + msg.guild.name + '**' : ''}.`)
		return {content: 'Suggestion sent successfully.'}
	},
	cat: 'info',
	cd: 5000,
	args: ['suggestions'],
	desc: 'Send suggestions to the bot developer using this command.'
}