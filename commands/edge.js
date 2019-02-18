const fetch = require('node-fetch'), PNG = require('pngjs').PNG, Discord = require('discord.js')
function scanAround(x,y,w,h,func){for(let offX=-1;offX<2;offX++)for(let offY=-1;offY<2;offY++){let finX=x+offX,finY=y+offY;if(finX!==-1&&finY!==-1&&finX!==w&&finY!==h)func(finX,finY)}};function rgb2hsv(r,g,b){let v=Math.max(r,g,b),n=v-Math.min(r,g,b),h=n&&((v==r)?(g-b)/n:((v==g)?2+(b-r)/n:4+(r-g)/n));return[60*(h<0?h+6:h),v&&n/v,v]};function hsv2rgb(h,s,v){let f=(n,k=(n+h/60)%6)=>v-v*s*Math.max(Math.min(k,4-k,1),0);return[f(5),f(3),f(1)]}
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
				let data2 = Buffer.from(this.data)
				for (let y = 0; y < this.height; y++)
					for (let x = 0; x < this.width; x++) {
						let arr = [[],[],[]], idx = (this.width * y + x) << 2
						scanAround(x, y, this.width, this.height, (fx, fy) => {
							let idxf = (this.width * fy + fx) << 2
							for (let f = 0; f < 3; f++) arr[f].push(Math.abs(data2[idxf + f] - data2[idx + f]))
						})
						let mx = Math.max(Math.max(arr[0][0], arr[0][1], arr[0][2]), Math.max(arr[1][0], arr[1][1], arr[1][2]), Math.max(arr[2][0], arr[2][1], arr[2][2])) / 255 + 1,
							hsv = rgb2hsv(data2[idx] / 255, data2[idx + 1] / 255, data2[idx + 2] / 255)
						hsv[1] *= Math.pow(mx, 3)
						if (hsv[1] > 1) hsv[1] = 1
						let rgb = hsv2rgb(hsv[0], hsv[1], hsv[2])
						this.data[idx] = rgb[0] * 255
						this.data[idx + 1] = rgb[1] * 255
						this.data[idx + 2] = rgb[2] * 255
					}
				client.q.cmdd(msg, 'Edge\'d!', new Discord.Attachment(this.pack(), 'demonisedOutput.png'))
			})
		)
}
exports.cat = 'fun'
exports.desc = `An image manipulation command which darkens pixels near edges. Works best with cartoon images, especially anime.
This command only supports PNG files. It will whether take the attached image in the message containing the command or the last image sent in the 10 latest sent messages.
Note that there are no plans to add support for other image formats, such as JPG or GIF.`
