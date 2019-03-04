module.exports = {
	run: async function (msg, args) {
		const commandName = args[0]
		if (client.commands.has(commandName)) delete require.cache[require.resolve(`./${commandName}.js`)]
		client.commands.delete(commandName)
		try {
			const props = require(`./${commandName}.js`)
			client.commands.set(commandName, props)
			client.help.build()
			return {
				content:`\`${commandName}\` successfully loaded!`
			}
		} catch (e) {
			if (e.code == 'MODULE_NOT_FOUND') throw new UserInputError(`Command \`${commandName}\` not found.`)
			else throw e
		}
	},
	cat: 'maint',
	own: true,
	args: ['command name'],
	desc: '(Re)loads the specified command.'
}