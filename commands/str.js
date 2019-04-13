let alph=['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'],regAr=['🇦','🇧','🇨','🇩','🇪','🇫','🇬','🇭','🇮','🇯','🇰','🇱','🇲','🇳','🇴','🇵','🇶','🇷','🇸','🇹','🇺','🇻','🇼','🇽','🇾','🇿']
module.exports = {
	run: async function (msg, p) {
		let text = p.join(' ')
		return new Promise(function (res, rej) {
			client.util.done(msg, 'Alright, I got the text. Now tell me what methods you want to apply to it. Keep in mind that you can see all available methods using the `help` command, and you only have 20 seconds.').then(function (ms) {
				let f = function (message) {
					if (message.channel.id === msg.channel.id && message.author.id === msg.author.id) {
						client.off('message', f)
						client.clearTimeout(t)
						let meth = message.content.split(' ')
						if (meth.length > 10) rej(new UserInputError('Too many methods were given! (> 10)'))
						while (meth[0]) {
							let s = meth.shift(), c = s.split('-')
							let pn = parseInt(c[1])
							if (isNaN(pn)) pn = 1
							if (pn > 10) pn = 10
							switch(c[0]) {
							case 'aest':
								text = [...text].join(' '.repeat(pn))
								break
							case 'clap':
								text = text.split(' ').join(' 👏 ')
								break
							case 'rev':
								text = [...text].reverse().join('')
								break
							case 'upper':
								text = text.toUpperCase()
								break
							case 'lower':
								text = text.toLowerCase()
								break
							case 'ita':
								text = `*${text}*`
								break
							case 'bold':
								text = `**${text}**`
								break
							case 'code':
								text = `\`${text}\``
								break
							case 'codeblock':
								text = `\`\`\`${text}\`\`\``
								break
							case 'drag':
								text = [...text]
								let drag = ''
								for (let i of text) drag += i.repeat(pn)
								text = drag
								break
							case 'circle':
								text = text.toLowerCase().replace(/[a-z]/g, function(char) {
									return String.fromCharCode(char.charCodeAt(0) + 9327)
								})
								break
							case 'regind':
								let regind = ''
								text = [...text]
								for (let x = 0; x < text.length; x++) regind += (regAr[alph.indexOf(text[x].toLowerCase())] ? (regAr[alph.indexOf(text[x-1] ? text[x-1].toLowerCase() : undefined)] ? '' : ' ') + regAr[alph.indexOf(text[x].toLowerCase())] + ' ' : text[x])
								text = regind.trim()
								break
							case 'mock':
								let mock = ''
								text = [...text]
								for (let x = 0; x < text.length; x++) mock += (text[x] === 'i' ? 'i' : Math.round(Math.random()) === 1 ? text[x].toUpperCase() : text[x].toLowerCase())
								text = mock
								break
							}
							if (text.length > 800) text = text.substring(0, 800)
						}
						text = client.util.clean(text)
						ms.delete().catch(()=>undefined)
						res({content: text, traces: [message]})
					}
				}
				let t = client.setTimeout(function () {
					client.off('message', f)
					rej(new UserInputError('Timeout! You took too long to reply.'))
				}, 20000)
				client.on('message', f)
			}).catch(function () {
				res(undefined)
			})
		})
	},
	cat: 'strp',
	args: ['text'], argCount: 1,
	desc: `Iterative text processing command. Methods:
*aest-number* : Puts the text italic and inside backticks.
*clap* : Adds a clap between each word.
*rev* : Reverses text.
*upper*, *lower* : Cases.
*ita* : Italic.
*bold* : Bold.
*code* : Wraps text around a pair of backticks.
*codeblock* : Puts text in a code block.
*drag-number* : Repeats each character for a number of times.
*regind* : Turns any letter into a regional indicator emoji containing the same letter.
*circle* : Same as \`regind\` but converts letters to circled letters.
*mock* : Random capitalisation.

An example: Doing \`str bottom text\` then sending \`upper code ita bold\` yields:
***\`BOTTOM TEXT\`***`
}