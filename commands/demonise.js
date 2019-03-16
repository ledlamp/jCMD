module.exports = {
	run: async function (msg) {
		msg.channel.startTyping()
		let image = msg.attachments.first()
		if (!image || !image.width) {
			let lastMsgs = await msg.channel.fetchMessages({ limit: 10 }), found = false
			lastMsgs.map(m => {
				if (found) return
				let attch = m.attachments.first()
				if (!attch && m.embeds[0] && m.embeds[0].image) {
					attch = m.embeds[0].image
					attch.url = attch.url.split('?size=')[0]
				}
				if (attch && attch.width && (attch.url.endsWith('.png') || attch.url.endsWith('.jpg') || attch.url.endsWith('.jpeg'))) {
					found = true
					image = attch
					if (m.author.id === client.user.id) m.delete().catch(()=>undefined)
				}
			})
		}
		if (!image) {
			msg.channel.stopTyping()
			throw new UserInputError('No images found in the last 10 messages here.')
		}
		if (image.width * image.height > 3200000) {
			msg.channel.stopTyping()
			throw new UserInputError(`Image too large. (${image.width} × ${image.height})`)
		}
		return Jimp.read(image.url)
		.then(async function (image) {
			for (let y = 0; y < image.bitmap.height; y++) for (let x = 0; x < image.bitmap.width; x++) {
				let idx = (image.bitmap.width * y + x) << 2, foof = Math.round(Math.random()) ? 1.2 : 0.4
				image.bitmap.data[idx] = Math.floor((image.bitmap.data[idx] + image.bitmap.data[idx + 1] + image.bitmap.data[idx + 2]) / 3 * foof)
				image.bitmap.data[idx + 1] = Math.floor(Math.pow(image.bitmap.data[idx] / 255, 10) * 255)
				image.bitmap.data[idx + 2] = Math.floor(image.bitmap.data[idx + 1] * 0.87)
			}
			msg.channel.stopTyping()
			return {
				content: 'Done. Here is what all of you sick people have been waiting for.',
				options: new Discord.Attachment(await image.getBufferAsync(Jimp.PNG), 'demonisedOutput.png')
			}
		})
	},
	cat: 'img',
	desc: 'A deep-fry like image-manipulation command which makes everything red and creepy. This thing will absolutely bake everything you love to pure blood.\nThis command will whether take the attached image in the message containing the command or the last image sent in the 10 latest sent messages.',
	aliases: ['demonize']
}