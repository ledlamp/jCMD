module.exports = {
	run: async function (msg, p) {
		const resID = client.config.ownerID
		let check = true, csl = '', buf = undefined
		try {
			csl = String(require('child_process').spawn('pm2', ['restart','index']))
			if (csl.length > 1800) buf = Buffer.from(csl)
		} catch (err) {
			check = false
			csl = err
		}
		return {
			content: (check ? '**Returned from spawn function:**' : '**Error occured:**') + (buf ? '' : '\n```js\n' + csl + '```'),
			options: buf ? new Discord.Attachment(buf, 'output.txt') : undefined
		}
	},
	cat: 'maint',
	own: true,
	desc: 'Restart the bot.'
}