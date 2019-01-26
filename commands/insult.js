exports.run = async function(client, msg) {
	msg.channel.send(client.rnd.insultGet(msg))
}
exports.cat = "fun"
exports.cd = 3000
exports.desc = "Sends a random insult that usually pops up when ya normies do `eval`. Might contain a tiny little bit of profanity, but I think it should be fine for most of Discord users."
