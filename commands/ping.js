module.exports = {
	run: async function (msg) {
		msg.channel.send('Ping...')
		.then(function (m) {
			m.edit(`Ping... pong! Latency: ${m.createdTimestamp - msg.createdTimestamp}ms, API latency: ${Math.round(client.ping)}ms.`).catch(()=>undefined)
		})
		.catch(()=>undefined)
	},
	cat: 'util',
	desc: 'Measures then shows the bot\'s Internet connection\'s latency. Normally, the values should be between 50 and 400 milliseconds.'
}