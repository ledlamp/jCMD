module.exports = {
	subCmd: {
		set: {
			run: async function (msg, args) {
				let cf = client.data.guilds.get(msg.guild.id) || {}, count = parseInt(args[0])
				if (isNaN(count) || count > 50 || count < 2) throw new UserInputError('Please provide a number between 2 and 50 for the maximum number of emojis allowed in a message.')
				cf.emjLim = count
				client.data.writeGuild(msg.guild.id, cf)
				return {content: `Set the emoji count limit to **${count}**.`}
			},
			desc: 'Set the number of maximum emojis allowed in a message.',
			perm: 'MANAGE_GUILD', args: ['emoji count limit'], argCount: 1
		},
		add: {
			run: async function (msg, args) {
				let cf = client.data.guilds.get(msg.guild.id) || {}, addedChs = []
				if (!cf.emjLim) throw new UserInputError('You need to first provide a emoji count limit using the `emojilimit set` command.')
				if (!cf.emjChs) cf.emjChs = []
				for (let ch of args) {
					let chn = client.util.getChannel(msg, ch)
					if (chn && !cf.autoDel.includes(chn.id) && chn.permissionsFor(chn.guild.me).has('MANAGE_MESSAGES')) {
						if (chn.type === 'text' && cf.emjChs.indexOf(chn.id) === -1) {
								cf.emjChs.push(chn.id)
								addedChs.push('`#' + chn.name + '`')
						} else if (chn.type === 'category') chn.children.map(chan => {
							if (chan.type === 'text' && cf.emjChs.includes(chan.id)) {
								cf.emjChs.push(chan.id)
								addedChs.push('`#' + chan.name + '`')
							}
						})
					}
				}
				if (cf.emjChs.length > 30) return {content: "You have exceeded the maximum channel limit of 30. Changes not saved."}
				if (addedChs.length > 0) {
					client.data.writeGuild(msg.guild.id, cf)
					return {content: `Added channels:\n${addedChs.join(',\n')}`}
				} else return {content: 'No valid channels added. Check your spelling, whether the channels are already added and whether they allow the bot to manage messages.'}
			},
			desc: 'Add channels to monitoring list. Provide a category channel ID to add all its child channels.',
			perm: 'MANAGE_GUILD', args: ['channels / channel IDs'], argCount: 1
		},
		remove: {
			run: async function (msg, args) {
				let cf = client.data.guilds.get(msg.guild.id) || {}, addedChs = []
				if (!cf.emjLim) throw new UserInputError('You need to first provide a emoji count limit using the `emojilimit set` command.')
				if (!cf.emjChs) cf.emjChs = []
				for (let ch of args) {
					let chn = client.util.getChannel(msg, ch)
					if (chn) {
						if (chn.type === 'text') {
							let ind = cf.emjChs.indexOf(chn.id)
							if (ind !== -1) {
								cf.emjChs.splice(ind, 1)
								addedChs.push('`#' + chn.name + '`')
							}
						}
						else if (chn.type === 'category') chn.children.map(chan => {
							if (chan.type === 'text') {
								let ind = cf.emjChs.indexOf(chan.id)
								if (ind !== -1) {
									cf.emjChs.splice(ind, 1)
									addedChs.push('`#' + chan.name + '`')
								}
							}
						})
					}
				}
				if (addedChs.length > 0) {
					client.data.writeGuild(msg.guild.id, cf)
					return {content: `Removed channels:\n${addedChs.join(',\n')}`}
				} else return {content: 'No valid channels removed. Check your spelling and whether the channels are already removed.'}
			},
			desc: 'Remove channels from monitoring list. Provide a category channel ID to remove all its child channels.',
			perm: 'MANAGE_GUILD', args: ['channels / channel IDs'], argCount: 1
		},
		list: {
			run: async function (msg) {
				let chs = [], cf = client.data.guilds.get(msg.guild.id)
				if (!cf || !cf.emjLim) return {content: 'There are no channels in this guild being monitored.'}
				if (!cf.emjChs) return {content: `Emoji count limit: **${cf.emjLim}**\nThere are no channels in this guild being monitored.`}
				cf.emjChs.map(ch => {
					let cho = client.util.getChannel(msg, ch)
					if (cho) chs.push('`#' + cho.name + '`')
				})
				return {content: `Emoji count limit: **${cf.emjLim}**\nChannels being monitored:\n${chs.join(',\n')}`}
			},
			desc: 'Show all channels in the monitoring list and the emoji count limit.',
		},
		reset: {
			run: async function (msg) {
				let cf = client.data.guilds.get(msg.guild.id)
				if (cf) {
					delete cf.emjChs
					delete cf.emjLim
					client.data.writeGuild(msg.guild.id, cf)
				}
				return {content: 'Emoji limiting functionality reset.'}
			},
			perm: 'MANAGE_GUILD',
			desc: 'Clear the entirety of the monitoring list and all options.'
		}
	},
	cat: 'mod',
	reqGuild: true,
	desc: 'Moderation tool for deleting messages containing more emojis than allowed.\nIf the bot doesn\'t seem to work, check whether it can send and manage messages in monitored channels.'
}