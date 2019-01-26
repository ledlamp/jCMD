exports.run = async (client, msg) => {
	msg.channel.send(client.emojis.get("528847371782586368").toString()).catch(()=>{})
}
exports.cat = "fun"
exports.desc = "Sends an extra hype blob emoji."
