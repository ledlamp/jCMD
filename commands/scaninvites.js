module.exports = {
	subCmd: {
		add: {
			run: async function (msg, args) {
				let cf = client.data.guilds.get(msg.guild.id) || {}, addedChs = []
				if (!cf.invScan) cf.invScan = []
				for (let ch of args) {
					let chn = client.util.getChannel(msg, ch)
					if (chn && !cf.autoDel.includes(chn.id) && chn.permissionsFor(chn.guild.me).has('MANAGE_MESSAGES')) {
						if (chn.type === 'text' && !cf.invScan.includes(chn.id)) {
								cf.invScan.push(chn.id)
								addedChs.push('`#' + chn.name + '`')
						} else if (chn.type === 'category') chn.children.map(chan => {
							if (chan.type === 'text' && !cf.invScan.includes(chan.id)) {
								cf.invScan.push(chan.id)
								addedChs.push('`#' + chan.name + '`')
							}
						})
					}
				}
				if (cf.invScan.length > 20) return {content: "You have exceeded the maximum channel limit of 20. Changes not saved."}
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
				if (!cf.invScan) cf.invScan = []
				for (let ch of args) {
					let chn = client.util.getChannel(msg, ch)
					if (chn) {
						if (chn.type === 'text') {
							let ind = cf.invScan.indexOf(chn.id)
							if (ind !== -1) {
								cf.invScan.splice(ind, 1)
								addedChs.push('`#' + chn.name + '`')
							}
						}
						else if (chn.type === 'category') chn.children.map(chan => {
							if (chan.type === 'text') {
								let ind = cf.invScan.indexOf(chan.id)
								if (ind !== -1) {
									cf.invScan.splice(ind, 1)
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
			run: async function(msg) {
				let chs = [], cf = client.data.guilds.get(msg.guild.id)
				if (!cf || !cf.invScan) return {content: 'There are no channels in this guild being scanned for invites.'}
				cf.invScan.map(ch => {
					let cho = client.util.getChannel(msg, ch)
					if (cho) chs.push('`#' + cho.name + '`')
				})
				return {content: `Channels being scanned:\n${chs.join(',\n')}`}
			},
			desc: 'Show all channels in the monitoring list.'
		},
		notify: {
			subCmd: {
				set: {
					run: async function (msg, p) {
						let cf = client.data.guilds.get(msg.guild.id) || {}
						if (!cf.invScan) throw new UserInputError('You don\'t have any channels being scanned.')
						if (p[0].toLowerCase() === 'here') {
							cf.invNoti = 'h'
							client.data.writeGuild(msg.guild.id, cf)
							return {content: 'Set the notifying channel to be the same as the deleted message\'s channel.'}
						}
						let ch = client.util.getChannel(msg, p[0])
						if (!ch || ch.type !== 'text') throw new UserInputError('Invalid channel. The notifier channel needs to be an existing text channel.')
						cf.invNoti = ch.id
						client.data.writeGuild(msg.guild.id, cf)
						return {content: `Set the notifying channel to \`#${ch.name}\`.`}
					},
					args: ['channel / channel ID / \'here\''], argCount: 1,
					desc: 'Set the channel for the bot to send a notification for when it deletes a message that contains an expired invite. Use \'here\' instead of a channel to make it dynamically the same as the channel of the deleted message.'
				},
				reset: {
					run: async function (msg) {
						let cf = client.data.guilds.get(msg.guild.id) || {}
						delete cf.invNoti
						client.data.writeGuild(msg.guild.id, cf)
						return {content: 'Stopped notifying users of invalid messages.'}
					},
					desc: 'Stop the bot from notifying when it deletes a message with invalid invites.'
				}
			},
			perm: 'MANAGE_GUILD',
			desc: 'An optional configuration which lets the bot tell users that their messages have been deleted.'
		},
		reset: {
			run: async function (msg) {
				let cf = client.data.guilds.get(msg.guild.id)
				if (cf && cf.invScan) {
					delete cf.invScan
					delete cf.invNoti
					client.data.writeGuild(msg.guild.id, cf)
				}
				return {content: 'Invite scanning functionality reset.'}
			},
			perm: 'MANAGE_GUILD',
			desc: 'Clear the entirety of the monitoring list and all options.'
		}
	},
	cat: 'mod',
	reqGuild: true,
	desc: 'Moderation tool for deleting messages containing invalid invites. Useful for advertisement-focused servers.\nIf the bot doesn\'t seem to work, check whether it can send and manage messages in monitored channels.'
}