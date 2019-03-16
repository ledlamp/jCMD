module.exports = function (chn) {
	let cf = client.data.guilds.get(chn.guild.id)
	if (!cf) return
	if (chn.type === 'text') {
		if (cf.autoDel) {
			let ind = cf.autoDel.indexOf(chn.id)
			if (ind !== -1) cf.autoDel.splice(ind, 1)
		}
		if (cf.invScan) {
			let ind = cf.invScan.indexOf(chn.id)
			if (ind !== -1) cf.invScan.splice(ind, 1)
		}
	}
	client.data.writeGuild(chn.guild.id, cf)
}