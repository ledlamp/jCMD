module.exports = {
	run: async function (msg, p) {
		let cf = client.data.guilds.get(msg.guild.id) || {}
		if (!p[0]) {
			delete cf.prefix
			client.data.writeGuild(msg.guild.id, cf)
			return {
				content: `Prefix reset.`
			}
		}
		else cf.prefix = p[0]
		client.data.writeGuild(msg.guild.id, cf)
		return {
			content: `Prefix set to \`${p[0]}\`.`
		}
	},
	cat: 'maint',
	reqGuild: true,
	own: true,
	desc: 'Like the command `prefix`, but forcefully. Give no arguments to reset the server\'s custom prefix.'
}