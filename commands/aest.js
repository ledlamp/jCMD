exports.subCmd = {
	const: {
		desc: 'Adds a constant number of spaces.',
		args: ['number', 'text'],
		run: async function(client, msg, p) {
			let number = parseInt(p.shift())
			if (isNaN(number)) return client.q.cmdthr(msg, 'I expected a number. Okay then.')
			let letters = p.join(' ').toUpperCase().split(''), str = '***`'
			for (let oof of letters) str += oof + ' '.repeat(number)
			str += '`***'
			if(str.length > 1950) return client.q.cmdw(msg, 'Ouch! The output is too long to be crammed into a single message. Try something shorter.')
			client.q.cmdd(msg, str)
		}
	},
	rnd: {
		desc: 'Adds a random number of spaces.',
		args: ['max space count', 'text'],
		run: async function(client, msg, p) {
			let number = parseInt(p.shift())
			if (isNaN(number)) return client.q.cmdthr(msg, 'I expected a number. Okay then.')
			let letters = p.join(' ').toUpperCase().split(''), str = '***`'
			for (let oof of letters) str += oof + ' '.repeat(Math.round(Math.random() * number))
			str += '`***'
			if(str.length > 1950) return client.q.cmdw(msg, 'Ouch! The output is too long to be crammed into a single message. Try something shorter.')
			client.q.cmdd(msg, str)
		}
	}
}
exports.cat = 'strp'
exports.desc = 'Adds a number of spaces to inputted text. For example, doing `aest const 1 example` gives ***`e x a m p l e`***.'
