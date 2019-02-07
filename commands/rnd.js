exports.run = async function(client, msg, msgP) {
	let min = parseInt(msgP[0]), max = parseInt(msgP[1])
	if(!isNaN(min) || !isNaN(max)) return client.q.cmdw(msg, 'Your random number is... uhh... you didn\'t give actual numbers. Okay.')
	if (min > max) {
		let x = max
		max = min
		min = x
	}
	client.q.cmdd(msg, `Your random number is ${Math.round(Math.random() * (max - min)) + min}.`)
}
exports.cat = 'util'
exports.args = ['a', 'b']
exports.desc = 'Gives a random number between (a) and (b).'
