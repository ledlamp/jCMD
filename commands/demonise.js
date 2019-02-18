const fetch = require('node-fetch'), PNG = require('pngjs').PNG, Discord = require('discord.js')
exports.run = async (client, msg) => {
	let image = msg.attachments.first()
	if (!image || !image.width) {
		let lastMsgs = await msg.channel.fetchMessages({ limit: 10 }), found = false
		lastMsgs.map(m => {
			if (found) return
			let attch = m.attachments.first()
			if (attch && attch.width && attch.url.endsWith('.png')) {
				found = true
				image = attch
			}
		})
	}
	if (!image) return client.q.cmdthr(msg, 'No PNG images found in the last 10 messages here.')
	fetch(image.url)
		.then(res => res.body.pipe(new PNG({ filterType: 4 }))
			.on('parsed', function () {
				for (let y = 0; y < this.height; y++) for (let x = 0; x < this.width; x++) {
					let idx = (this.width * y + x) << 2, foof = Math.round(Math.random()) + 0.1
					this.data[idx] = Math.floor((this.data[idx] + this.data[idx + 1] + this.data[idx + 2]) / 3 * foof) * foof
					this.data[idx + 1] = Math.floor(Math.pow(this.data[idx] / 255, 10) * 25.5) * 10
					this.data[idx + 2] = Math.floor(this.data[idx + 1] * 0.87)
				}
				client.q.cmdd(msg, 'Done. Here is what all of you sick people have been waiting for.', new Discord.Attachment(this.pack(), 'demonisedOutput.png'))
			})
		)
}
exports.cat = 'fun'
exports.desc = `A deep-fry like image-manipulation command which makes everything red and creepy. This thing will absolutely bake everything you love to pure blood.
This command only supports PNG files. It will whether take the attached image in the message containing the command or the last image sent in the 10 latest sent messages.
Note that there are no plans to add support for other image formats, such as JPG or GIF.`
