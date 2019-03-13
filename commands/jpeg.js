module.exports = {
	cat: 'img',
	desc: `An image-manipulation command which JPEG-ifies images.
This command will whether take the attached image in the message containing the command or the last image sent in the 10 latest sent messages.`,
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
				}
			})
		}
		if (!image) {
			msg.channel.stopTyping()
			throw new UserInputError('No images found in the last 10 messages here.')
		}
		if (image.width * image.height > 3200000) {
			msg.channel.stopTyping()
			throw new UserInputError('Image too large.')
		}
		return Jimp.read(image.url)
		.then(async function (image) {
			image
			.resize(Math.floor(image.bitmap.width / 2.5 + 512), Jimp.AUTO)
			.quality(2)
			msg.channel.stopTyping()
			return {
				content: 'Crunchy.',
				options: new Discord.Attachment(await image.getBufferAsync(Jimp.MIME_JPEG), 'jpegifiedOutput.png')
			}
		})
	}
}