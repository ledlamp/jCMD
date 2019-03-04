module.exports = function () {
	console.timeEnd('login')
	console.log(`Logged in as ${client.user.tag}, currently monitoring ${client.guilds.size} server(s), ${client.users.size} user(s).`)
	Promise.all([client.data.users.defer, client.data.guilds.defer])
	.then(function () {
		console.log(`Data: loaded ${client.data.users.size} user entries, ${client.data.guilds.size} guild entries.`)
		client.on('message', require('./message.js'))
	})
	client.lang.play()
	setInterval(function () {client.lang.play()}, 20000)
}