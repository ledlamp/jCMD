module.exports = function () {
	console.timeEnd('login')
	console.log(`Logged in as ${client.user.tag}, currently monitoring ${client.guilds.size} server(s), ${client.users.size} user(s).`)
	Promise.all([client.data.users.defer, client.data.guilds.defer])
	.then(function () {
		console.log(`Data: loaded ${client.data.users.size} user entries, ${client.data.guilds.size} guild entries.`)
		client.on('message', require('./message.js'))
		// Invite scanning
		setInterval(function () {
			client.guilds.map(async function (guild) {
				let cfg = client.data.guilds.get(guild.id)
				if (cfg && cfg.invScan) guild.channels.map(async function (channel) {
					if (channel.type === 'text') channel.fetchMessages({limit: 15}).then(function (msgs) {
						msgs.map(function (msg) {
							client.util.getInv(msg.content).map(function (code) {
								client.util.checkInv(code).then(function (bool) {if (!bool && msg.deletable) msg.delete().catch(()=>undefined)})
							})
						})
					})
				})
			})
		}, 120000)
	})
	client.lang.play()
	setInterval(function () {client.lang.play()}, 20000)
}