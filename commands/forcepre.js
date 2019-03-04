module.exports = {
	run: async function (msg, p) {
		let cf = client.data.guilds.get(msg.guild.id)
		if (!p[0]) delete cf.prefix
		else cf.prefix = p[0]
		client.data.writeGuild(msg.guild.id, cf)
	},
	cat: 'maint',
	reqGuild: true,
	own: true,
	desc: 'Like the command `prefix`, but forcefully. Give no arguments to reset the server\'s custom prefix.'
}