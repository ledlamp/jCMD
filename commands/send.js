exports.run = async function(client, msg, p) {
	p = p.join(' ')
	let time = new Date(Date.now())
	let month = Intl.DateTimeFormat('en-UK', {month: 'long'}).format(time.getMonth())
	msg.channel.send(client.q.clean(`${p.length > 200 ? p.slice(0, 200) : p}\n   *- ${msg.author.tag}, ${month} of ${time.getFullYear()}*`)).catch(()=>{})
	msg.delete().catch(()=>{})
}
exports.cat = 'fun'
exports.args = ['text']
exports.desc = 'Sends a message with mentioned content, with extra fancy formatting.'
