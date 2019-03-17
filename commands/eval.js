module.exports = {
	run: async function (msg, p) {
		let check = true, csl = '', buf = Buffer.from('')
		try {
			csl = String(eval(p.join(' ')))
			if (csl.length > 1800) buf = Buffer.from(csl)
		} catch (err) {
			check = false
			csl = err
		}
		return {
			content: (check ? '**Returned:**' : '**That didn\'t go well.**') + (buf ? '' : '\n```js\n' + csl + '```'),
			options: buf ? new Discord.Attachment(buf, 'output.txt') : undefined
		}
	},
	cat: 'maint',
	own: true,
	args: ['JavaScript code'],
	desc: 'Runs specified code.'
}