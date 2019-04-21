module.exports = {
	run: async function (msg, p) {
		let check = true, csl = '', buf = undefined
		try {
			csl = String(eval(p.join(' ')))
			if (csl.length > 1800) buf = Buffer.from(csl)
		} catch (err) {
			check = false
			csl = err
		}
		if (csl.length > 16580000) throw new UserInputError('The output is too long to be sent in a message or through a file. RIP.')
		return {
			content: (check ? '**Returned:**' : '**That didn\'t go well.**') + (buf ? '' : '\n```js\n' + csl + '```'),
			options: buf ? new Discord.Attachment(buf, 'output.txt') : undefined
		}
	},
	cat: 'maint',
	own: true,
	args: ['JavaScript code'], argCount: 1,
	desc: 'Runs specified code.',
	aliases: ['e']
}