module.exports = function () {
	console.timeEnd('login')
	console.log(`Logged in as ${client.user.tag}, currently monitoring ${client.guilds.size} server(s), ${client.users.size} user(s).`)
	Promise.all([client.data.users.defer, client.data.guilds.defer])
	.then(function () {
		console.log(`Data: loaded ${client.data.users.size} user entries, ${client.data.guilds.size} guild entries.`)
		// Load events
		fs.readdir('./events/', function (err, files) {
			if (err) return console.error(err)
			files.map(function (file) {
				if (!file.endsWith('.js') || file === 'ready.js') return
				const event = require(`./${file}`)
				let eventName = file.split('.')[0]
				client.on(eventName, event)
			})
		})
		client.data.guilds.map(function (v, k) {
			if (!client.guilds.has(k)) return client.data.guilds.delete(k)
			let guild = client.guilds.get(k)
			if (v.autoDel) v.autoDel.map(function (ch) {
				if (!guild.channels.has(ch)) v.autoDel.splice(v.autoDel.indexOf(ch), 1)
			})
			if (v.invScan) v.invScan.map(function (ch) {
				if (!guild.channels.has(ch)) v.invScan.splice(v.invScan.indexOf(ch), 1)
				if (v.invScan.length === 0) delete v.invNoti
			})
		})
	})
	client.lang.play()
	client.setInterval(function () {client.lang.play()}, 30000)
}