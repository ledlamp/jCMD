module.exports = {
	run: async function(msg, p) {
		let deleteCount = parseInt(p[0], 10) + 1
		if (isNaN(deleteCount) || deleteCount < 2 || deleteCount > 1000) throw new UserInputError('Please provide a number between 1 and 999 for the number of messages to delete.')
		while (deleteCount > 100) {
			let fetched = await msg.channel.fetchMessages({
				limit: 100
			})
			try {
				await msg.channel.bulkDelete(fetched)
			} catch {
				throw new UserInputError(`Couldn't delete messages. Error: ${error.message}`)
			}
			deleteCount -= 100
		}
		let fetched = await msg.channel.fetchMessages({
			limit: deleteCount
		})
		try {
			await msg.channel.bulkDelete(fetched)
		} catch {
			throw new UserInputError(`Couldn't delete messages. Error: ${error.message}`)
		}
	},
	cat: 'mod',
	reqGuild: true,
	perm: 'MANAGE_MESSAGES',
	botPerm: 'MANAGE_MESSAGES',
	args: ['number, 1 -> 999'],
	desc: 'Deletes the most recent (number) messages, plus the message containing the command.'
}