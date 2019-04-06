module.exports = {
	run: async function (msg) {
		let c = (new Discord.Collection(client.data.users.filter(function (u) {
			return u.hasOwnProperty('bal')
		}))).sort(function (a, b) {
			return b.bal - a.bal
		})
		if (c.size === 0) return {content: 'There is no money.'}
		let a = [], x = 0
		for (let e of c) {
			if (x++ == 10) break
			a.push(e)
		}
		x = 0
		return {content: 'Rich peeps who don\'t deserve no attention:\n```js\n' + c.map(function (v, k) {return `#${++x} - ${client.users.get(k).tag}:\n\t\t${v.bal} credits`}).join('\n\n') + '```'}
	},
	cat: 'fun',
	desc: 'Shows the top 10 people with the most credits.',
	aliases: ['top']
}