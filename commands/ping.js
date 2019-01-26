exports.run = async (client, msg) => {
	const m = await msg.channel.send("Ping...").catch(()=>{})
	m.edit(`Ping... pong! Latency: ${m.createdTimestamp - msg.createdTimestamp}ms, API latency: ${Math.round(client.ping)}ms. Super disgusting numbers, as always.`).catch(()=>{})
}
exports.cat = "util"
exports.desc = "Measures and then shows the bot's Internet connection's latency. Normally, the values should be around 200 to 600 milliseconds."
