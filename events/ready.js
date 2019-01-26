module.exports = (client) => {
  console.log(`Logged in as ${client.user.tag}. (${client.guilds.size} servers, ${client.users.size} users)`)
	client.rnd.play()
	setInterval(async function() {client.rnd.play()}, 20000)
}
