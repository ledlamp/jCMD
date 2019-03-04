module.exports = {
	run: async function (msg, args) {
		if (args[0] === 'reset') {
			let cf = client.data.guilds.get(msg.guild.id) || {}
			delete cf.invScan
			client.data.writeGuild(msg.guild.id, cf)
			return {
				content: `Invite scanning functionality reset.`
			}
		}
		let cf = client.data.guilds.get(msg.guild.id) || {}, addedChs = []
		for (let ch of args) {
			let chn = client.util.getChannel(msg, ch)
			if (!cf.invScan) cf.invScan = []
			if (chn) {
				if (chn.type === 'text') {
					cf.invScan.push(chn.id)
					addedChs.push('`#' + chn.name + '`')
				}
				if (chn.type === 'category') chn.map(chan => {
					if (chan.type === 'text') {
						cf.invScan.push(chan.id)
						addedChs.push('`#' + chan.name + '`')
					}
				})
			}
		}
		if (addedChs.length > 0) {
			client.data.writeGuild(msg.guild.id, cf)
			return {
				content: `Added channels:\n${addedChs.join(',\n')}`
			}
		}
	},
	noParse: async function(msg) {
		let chs = [], cf = client.data.guilds.get(msg.guild.id)
		if (!cf || !cf.invScan) return {
			content: 'There are no channels in this guild being scanned for invites.'
		}
		cf.invScan.map(ch => {
			let cho = client.util.getChannel(msg, ch)
			if (cho) chs.push('`#' + cho.name + '`')
		})
		return {
			content: `Added channels:\n${chs.join(',\n')}`
		}
	},
	perm: 'MANAGE_GUILD', args: ['channels / channel IDs']
}