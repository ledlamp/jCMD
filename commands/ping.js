module.exports = {
	run: async function (msg) {
		msg.channel.send('Ping...')
		.then(function (m) {
			m.edit(`Ping... pong! API latency: ${m.createdTimestamp - msg.createdTimestamp}ms, Websocket latency: ${Math.round(client.ping)}ms.`).catch(()=>undefined)
		})
		.catch(()=>undefined)
	},
	cat: 'util',
	desc: 'Measures then shows the bot\'s Internet connection\'s latency..'
}