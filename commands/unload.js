exports.run = (client, msg, args) => {
	const commandName = args[0]
	if (!client.commands.has(commandName)) client.q.cmdthr(msg, `Command \`${commandName}\` not found.`)
	delete require.cache[require.resolve(`./${commandName}.js`)]
	client.commands.delete(commandName)
	client.q.cmdd(msg, `\`${commandName}\` successfully unloaded!`)
	client.q.buildHelp()
}
exports.cat = "maint"
exports.own = true
exports.args = ["commmand name"]
exports.desc = "Reloads the specified command."
