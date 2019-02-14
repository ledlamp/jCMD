exports.run = async (client, msg) => {
	let image = msg.attachments.first()
	if (!image || !image.width) {
		let lastMsgs = await msg.channel.fetchMessages({ limit: 10 }), found = false
		lastMsgs.map(m => {
			if (found) return
			let attch = m.attachments.first()
			if (attch && attch.width) {
				found = true
				image = attch
			}
		})
	}
	if (!image) return client.q.cmdthr(msg, 'No images found in the last 10 messages here.')
	if (!image.url.endsWith('.png')) return client.q.cmdthr(msg, 'Image is not in PNG format. Please try again with a PNG file or use a converter.\nIf you do not want to use PNG, don\'t give up just yet. Support for JPG files is coming soon!')
	client.lib.fetch(image.url)
		.then(res => res.body.pipe(new client.lib.PNG({ filterType: 4 }))
			.on('parsed', function () {
				for (let y = 0; y < this.height; y++) for (let x = 0; x < this.width; x++) {
					let idx = (this.width * y + x) << 2, foof = Math.round(Math.random()) + 0.1
					this.data[idx] = Math.floor((this.data[idx] + this.data[idx + 1] + this.data[idx + 2]) / 3 * foof) * foof
					this.data[idx + 1] = Math.floor(Math.pow(this.data[idx] / 255, 10) * 25.5) * 10
					this.data[idx + 2] = Math.floor(this.data[idx + 1] * 0.87)
				}
				client.q.cmdd(msg, 'Done:', new client.lib.Discord.Attachment(this.pack(), 'demonisedOutput.png'))
			})
		)
}
exports.cat = 'fun'
exports.desc = `A deep-fry like image-manipulation command which makes everything red and creepy. This thing will absolutely bake everything you love to pure blood.
This command will whether take the attached image in the message containing the command or the last image sent in the 10 latest sent messages.`
