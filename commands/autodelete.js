module.exports = {
	subCmd: {
		add: {
			run: async function (msg, args) {
				let cf = client.data.guilds.get(msg.guild.id) || {}, addedChs = []
				if (!cf.autoDel) cf.autoDel = []
				for (let ch of args) {
					let chn = client.util.getChannel(msg, ch)
					if (chn && chn.permissionsFor(chn.guild.me).has('MANAGE_MESSAGES')) {
						if (chn.type === 'text' && !cf.autoDel.includes(chn.id)) {
								cf.autoDel.push(chn.id)
								addedChs.push('`#' + chn.name + '`')
						}	else if (chn.type === 'category') chn.children.map(chan => {
							if (chan.type === 'text' && !cf.autoDel.includes(chan.id)) {
								cf.autoDel.push(chan.id)
								addedChs.push('`#' + chan.name + '`')
							}
						})
					}
				}
				if (cf.autoDel.length > 30) return {content: "You have exceeded the maximum channel limit of 30. Changes not saved."}
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
				if (!cf.autoDel) cf.autoDel = []
				for (let ch of args) {
					let chn = client.util.getChannel(msg, ch)
					if (chn) {
						if (chn.type === 'text') {
							let ind = cf.autoDel.indexOf(chn.id)
							if (ind !== -1) {
								cf.autoDel.splice(ind, 1)
								addedChs.push('`#' + chn.name + '`')
							}
						}
						else if (chn.type === 'category') chn.children.map(chan => {
							if (chan.type === 'text') {
								let ind = cf.autoDel.indexOf(chan.id)
								if (ind !== -1) {
									cf.autoDel.splice(ind, 1)
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
				if (!cf || !cf.autoDel) return {content: 'There are no channels in this guild being monitored.'}
				cf.autoDel.map(ch => {
					let cho = client.util.getChannel(msg, ch)
					if (cho) chs.push('`#' + cho.name + '`')
				})
				return {content: `Channels being monitored:\n${chs.join(',\n')}`}
			},
			desc: 'Show all channels in the monitoring list.',
		},
		reset: {
			run: async function (msg) {
				let cf = client.data.guilds.get(msg.guild.id)
				if (cf && cf.autoDel) {
					delete cf.autoDel
					client.data.writeGuild(msg.guild.id, cf)
				}
				return {content: 'Auto deletion functionality reset.'}
			},
			perm: 'MANAGE_GUILD',
			desc: 'Clear the entirety of the monitoring list.'
		}
	},
	cat: 'mod',
	reqGuild: true,
	desc: 'Moderation tool for deleting messages of people who left the server. Useful for advertisement-focused servers.\nIf the bot doesn\'t seem to work, check whether it can send and manage messages in monitored channels.'
}