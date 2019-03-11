function scanAround(x,y,w,h,func){for(let offX=-1;offX<2;offX++)for(let offY=-1;offY<2;offY++){let finX=x+offX,finY=y+offY;if(finX!==-1&&finY!==-1&&finX!==w&&finY!==h)func(finX,finY)}};function rgb2hsv(r,g,b){let v=Math.max(r,g,b),n=v-Math.min(r,g,b),h=n&&((v==r)?(g-b)/n:((v==g)?2+(b-r)/n:4+(r-g)/n));return[60*(h<0?h+6:h),v&&n/v,v]};function hsv2rgb(h,s,v){let f=(n,k=(n+h/60)%6)=>v-v*s*Math.max(Math.min(k,4-k,1),0);return[f(5),f(3),f(1)]}
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
				}
			})
		}
		if (!image) {
			msg.channel.stopTyping()
			throw new UserInputError('No images found in the last 10 messages here.')
		}
		if (image.width * image.height > 1500000) {
			msg.channel.stopTyping()
			throw new UserInputError('Image too large.')
		}
		return Jimp.read(image.url)
		.then(async function (image) {
			let data2 = Buffer.from(image.bitmap.data)
			for (let y = 0; y < image.bitmap.height; y++)
				for (let x = 0; x < image.bitmap.width; x++) {
					let arr = [[],[],[]], idx = (image.bitmap.width * y + x) << 2
					scanAround(x, y, image.bitmap.width, image.bitmap.height, (fx, fy) => {
						let idxf = (image.bitmap.width * fy + fx) << 2
						for (let f = 0; f < 3; f++) arr[f].push(Math.abs(data2[idxf + f] - data2[idx + f]))
					})
					let mx = Math.max(Math.max(arr[0][0], arr[0][1], arr[0][2]), Math.max(arr[1][0], arr[1][1], arr[1][2]), Math.max(arr[2][0], arr[2][1], arr[2][2])) / 255 + 1,
						hsv = rgb2hsv(data2[idx] / 255, data2[idx + 1] / 255, data2[idx + 2] / 255)
					hsv[1] *= Math.pow(mx, 10)
					if (hsv[1] > 1) hsv[1] = 1
					let rgb = hsv2rgb(hsv[0], hsv[1], hsv[2])
					image.bitmap.data[idx] = rgb[0] * 255
					image.bitmap.data[idx + 1] = rgb[1] * 255
					image.bitmap.data[idx + 2] = rgb[2] * 255
				}
			msg.channel.stopTyping()
			return {
				content: 'Edge\'d, just for you honey.',
				options: new Discord.Attachment(await image.getBufferAsync(Jimp.AUTO), 'demonisedOutput.png')
			}
		})
	},
	cat: 'img',
	desc: `An image manipulation command which darkens pixels near edges. Works best with cartoon images, especially anime.
This command will whether take the attached image in the message containing the command or the last image sent in the 10 latest sent messages.`
}