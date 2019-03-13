module.exports = async function (guild) {
	client.data.guilds.delete(guild.id)
}