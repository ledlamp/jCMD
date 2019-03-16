exports.subCmd = {
	const: {
		run: async function(msg, p) {
			let number = parseInt(p.shift())
			if (isNaN(number)) throw new UserInputError('I expected a number. Okay then.')
			if (number > 10) throw new UserInputError('Inputted number is greater than 10.')
			let letters = p.join(' ').toUpperCase().split(''), str = '***`'
			for (let oof of letters) str += oof + ' '.repeat(number)
			str += '`***'
			if(str.length > 500) throw new UserInputError('Ouch! The output is too long to be crammed into a single message. Try something shorter.')
			return {content: str}
		},
		desc: 'Adds a constant number of spaces.',
		args: ['number', 'text']
	},
	rnd: {
		run: async function(msg, p) {
			let number = parseInt(p.shift())
			if (isNaN(number)) throw new UserInputError('I expected a number. Okay then.')
			if (number > 10) throw new UserInputError('Inputted number is greater than 10.')
			let letters = p.join(' ').toUpperCase().split(''), str = '***`'
			for (let oof of letters) str += oof + ' '.repeat(Math.round(Math.random() * number))
			str += '`***'
			if(str.length > 500) throw new UserInputError('Ouch! The output is too long to be crammed into a single message. Try something shorter.')
			return {content: str}
		},
		desc: 'Adds a random number of spaces.',
		args: ['max space count', 'text']
	}
}
exports.cat = 'strp'
exports.desc = 'Adds a number of spaces to inputted text. For example, doing `aest const 1 example` gives ***`e x a m p l e`***.'