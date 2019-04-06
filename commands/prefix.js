module.exports = {
	run: async function (msg, args) {
		if (args[0] === 'reset' || args[0] === client.config.prefix) {
			let cf = client.data.guilds.get(msg.guild.id) || {}
			delete cf.prefix
			client.data.writeGuild(msg.guild.id, cf)
			return {
				content: `Prefix reset.`
			}
		}
		if (args[0].length > 3) throw new UserInputError('Cannot set: prefix is longer than 3 characters.')
		if (client.util.clean(args[0]) !== args[0]) throw new UserInputError('Cannot set: prefix contains invalid characters, like @ or `.')
		let curpr = client.util.getPre(msg)
		if (args[0] === curpr) throw new UserInputError('Cannot set: prefix is the same as current prefix.')
		let cf = client.data.guilds.get(msg.guild.id) || {}
		cf.prefix = args[0]
		client.data.writeGuild(msg.guild.id, cf)
		return {
			content: `Prefix set to \`${args[0]}\`.`
		}
	},
	noArgs: async function(msg) {
		return {content: `The prefix for this server is \`${client.util.getPre(msg)}\`.`}
	},
	cat: 'mod',
	desc: 'Sets the prefix for this server.',
	noArgsDesc: 'Shows the current prefix for this server.',
	reqGuild: true,
	perm: 'MANAGE_GUILD',
	args: ['prefix'], argCount: 1
}