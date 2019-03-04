module.exports = {
	run: async function (msg, args) {
		const commandName = args[0]
		if (!client.commands.has(commandName)) throw new UserInputError(`Command \`${commandName}\` not found.`)
		delete require.cache[require.resolve(`./${commandName}.js`)]
		client.commands.delete(commandName)
		client.help.build()
		return {
			content: `Command \`${commandName}\` successfully unloaded.`
		}
	},
	cat: 'maint',
	own: true,
	args: ['command name'],
	desc: 'Unloads the specified command.'
}
