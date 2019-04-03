function morning(time) {
	return time - (time % 86400000)
}
module.exports = {
	run: async function (msg) {
		let d = client.data.users.get(msg.author.id) || {}, n = Date.now(), m = morning(n)
		if (d.daily > m) throw new UserInputError(`You can only collect daily rewards once per day, mate. Try again in ${Math.ceil(24 - (n - m) / 3600000)} hours.`)
		d.daily = n
		if (!d.bal) d.bal = 0
		d.bal += 200
		client.data.writeUser(msg.author.id, d)
		return {content: 'You just got 200 credits! Remember to come back tomorrow for more!'}
	},
	cat: 'fun',
	desc: 'Collect daily rewards.'
}