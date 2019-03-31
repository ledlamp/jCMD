module.exports = {
	run: async function (msg) {
		let d = client.data.users.get(msg.author.id) || {}, now = Date.now()
		if (d.daily && now - d.daily < 86400000) throw new UserInputError(`You can only collect daily rewards once per day, mate. Try again in ${Math.ceil(24 - (now - d.daily) / 3600000)} hours.`)
		d.daily = now
		if (!d.bal) d.bal = 0
		d.bal += 200
		client.data.writeUser(msg.author.id, d)
		return {content: 'You just got 200 credits! Remember to come back tomorrow for more!'}
	},
	cat: 'fun',
	desc: 'Collect daily rewards.'
}