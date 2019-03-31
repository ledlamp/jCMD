module.exports = {
	run: async function(msg, p) {
		let deleteCount = parseInt(p[0]) + 1
		if (isNaN(deleteCount) || deleteCount < 2 || deleteCount > 100) throw new UserInputError('Please provide a number between 1 and 99 for the number of messages to delete.')
		return msg.channel.bulkDelete(deleteCount, true).catch(err => {throw new UserInputError(`Couldn't delete messages. Error: ${err.message}`)})
	},
	cat: 'mod',
	reqGuild: true,
	perm: 'MANAGE_MESSAGES',
	botPerm: 'MANAGE_MESSAGES',
	args: ['number, 1 -> 99'],
	desc: 'Deletes the most recent (number) messages, plus the message containing the command.'
}