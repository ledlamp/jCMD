exports.run = async function(client, msg) {
	msg.channel.send(client.config.invite).catch(()=>{})
}
exports.cat = 'info'
exports.desc = 'Shows a link to invite the bot to your server.'
