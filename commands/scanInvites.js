module.exports = {
	subCmd: {
		add: {
			run: async function (msg, args) {
				let cf = client.data.guilds.get(msg.guild.id) || {}, addedChs = []
				if (!cf.invScan) cf.invScan = []
				for (let ch of args) {
					let chn = client.util.getChannel(msg, ch)
					if (chn) {
						if (chn.type === 'text') {
							if (cf.invScan.indexOf(chn.id) > -1) return
							cf.invScan.push(chn.id)
							addedChs.push('`#' + chn.name + '`')
						}
						if (chn.type === 'category') chn.children.map(chan => {
							if (chan.type === 'text') {
								if (cf.invScan.indexOf(chn.id) > -1) return
								cf.invScan.push(chan.id)
								addedChs.push('`#' + chan.name + '`')
							}
						})
					}
				}
				if (cf.invScan.length < 1) delete cf.invScan
				if (addedChs.length > 0) {
					client.data.writeGuild(msg.guild.id, cf)
					return {
						content: `Added channels:\n${addedChs.join(',\n')}`
					}
				} else return {
					content: 'No valid channels added.'
				}
			},
			desc: 'Add channels to monitoring list. Provide a category channel ID to add all its children channels.',
			perm: 'MANAGE_GUILD', args: ['channels / channel IDs']
		},
		remove: {
			run: async function (msg, args) {
				let cf = client.data.guilds.get(msg.guild.id) || {}, addedChs = []
				for (let ch of args) {
					let chn = client.util.getChannel(msg, ch)
					if (!cf.invScan) cf.invScan = []
					if (chn) {
						if (chn.type === 'text') {
							let ind = cf.invScan.indexOf(chn.id)
							if (ind === -1) return
							else cf.invScan.splice(ind, 1)
							addedChs.push('`#' + chn.name + '`')
						}
						if (chn.type === 'category') chn.children.map(chan => {
							if (chan.type === 'text') {
								let ind = cf.invScan.indexOf(chan.id)
								if (ind === -1) return
								else cf.invScan.splice(ind, 1)
								addedChs.push('`#' + chan.name + '`')
							}
						})
					}
				}
				if (cf.invScan.length < 1) delete cf.invScan
				if (addedChs.length > 0) {
					client.data.writeGuild(msg.guild.id, cf)
					return {
						content: `Removed channels:\n${addedChs.join(',\n')}`
					}
				} else {
					return {
						content: `No valid channels removed.`
					}
				}
			},
			desc: 'Remove channels from monitoring list. Provide a category channel ID to add all its children channels.',
			perm: 'MANAGE_GUILD', args: ['channels / channel IDs']
		},
		list: {
			run: async function(msg) {
				let chs = [], cf = client.data.guilds.get(msg.guild.id)
				if (!cf || !cf.invScan) return {
					content: 'There are no channels in this guild being scanned for invites.'
				}
				cf.invScan.map(ch => {
					let cho = client.util.getChannel(msg, ch)
					if (cho) chs.push('`#' + cho.name + '`')
				})
				return {
					content: `Channels being scanned:\n${chs.join(',\n')}`
				}
			},
			desc: 'Show all channels in the monitoring list.'
		},
		reset: {
			run: async function (msg) {
				let cf = client.data.guilds.get(msg.guild.id)
				if (cf) {
					delete cf.invScan
					client.data.writeGuild(msg.guild.id, cf)
				}
				return {
					content: `Invite scanning functionality reset.`
				}
			},
			perm: 'MANAGE_GUILD',
			desc: 'Clear the entirety of the monitoring list.'
		}
	},
	cat: 'mod',
	reqGuild: true,
	desc: 'Moderation tool for deleting messages containing invalid invites. Useful for advertisement-focused servers.\nIf the bot doesn\'t seem to work, check whether it can delete messages in monitored channels.'
}