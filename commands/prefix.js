exports.run = async function(client, msg, p) {
	let reset = (/reset/i).test(p[0])
	if (!reset) {
		let pre = client.q.clean(p[0])
		if (pre == '' || pre !== p[0]) return client.q.cmdthr(msg, 'Your prefix contains some invalid characters, like a space character, a ` or @.')
		if (pre.length > 3) return client.q.cmdthr(msg, 'Prefix is too long! (> 3 characters)')
		if (pre == client.config.prefix) reset = true
	}
	client.gConfig.write(msg, 'Prefix', function(msg, gConfig) {
		if(reset) delete gConfig.prefix
		else gConfig.prefix = p[0].trim()
	})
}
exports.noParse = async function(client, msg) {
	msg.channel.send(`The prefix for this server is \`${client.q.getPre(msg)}\`.`).catch(()=>{})
}
exports.noParseDesc = 'Shows the current prefix for this server.'
exports.cat = 'config'
exports.reqGuild = true
exports.perm = 'MANAGE_GUILD'
exports.args = ['prefix']
exports.cd = 5000
exports.desc = 'Change the command prefix for this server. Parse `reset` to clear.'
