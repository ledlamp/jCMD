exports.run = async (client, msg) => {
	msg.channel.send(client.config.about).catch(()=>{})
}
exports.cat = 'info'
exports.desc = 'Sends information about the bot.'
