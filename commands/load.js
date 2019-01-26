exports.run = (client, msg, args) => {
	const commandName = args[0]
	if (client.commands.has(commandName)) delete require.cache[require.resolve(`./${commandName}.js`)]
	client.commands.delete(commandName)
	try {
		const props = require(`./${commandName}.js`)
		client.commands.set(commandName, props)
		client.q.cmdd(msg, `\`${commandName}\` successfully loaded!`)
		client.q.buildHelp()
	} catch (e) {
		if (e.code == 'MODULE_NOT_FOUND') return client.q.cmdthr(msg, `Command \`${commandName}\` not found.`)
		else throw e
	}
}
exports.cat = "maint"
exports.own = true
exports.args = ["commmand name"]
exports.desc = "Reloads the specified command."