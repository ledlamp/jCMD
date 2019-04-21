module.exports = {
	run: async function(msg, p) {
		let deleteCount = parseInt(p[0]) + 1
		if (isNaN(deleteCount) || deleteCount < 2 || deleteCount > 1000) throw new UserInputError('Please provide a number between 1 and 99 for the number of messages to delete.')
		function deleter () {
			if (deleteCount > 100) {
				deleteCount -= 100
				return msg.channel.fetchMessages({limit: 100})
				.then(function (msgs) {
					return msg.channel.bulkDelete(msgs, true)
					.then(deleter)
					.catch(function (e) {
						throw e
					})
				})
				.catch(function (e) {
					return {
						content: 'Couldn\'t delete messages. ' + e.toString()
					}
				})
			} else {
				return msg.channel.fetchMessages({limit: deleteCount})
				.then(function (msgs) {
					return msg.channel.bulkDelete(msgs, true)
					.then(function () {
						return undefined
					})
				})
			}
		}
		return deleter()
	},
	cat: 'mod',
	reqGuild: true,
	perm: 'MANAGE_MESSAGES',
	botPerm: 'MANAGE_MESSAGES',
	args: ['number, 1 -> 999'], argCount: 1,
	desc: 'Deletes the most recent (number) messages, plus the message containing the command.'
}