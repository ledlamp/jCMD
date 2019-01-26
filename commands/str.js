let alph = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"]
let regAr = ["🇦","🇧","🇨","🇩","🇪","🇫","🇬","🇭","🇮","🇯","🇰","🇱","🇲","🇳","🇴","🇵","🇶","🇷","🇸","🇹","🇺","🇻","🇼","🇽","🇾","🇿"]

exports.run = async function(client, msg, p) {
	let both = p.join(" "), text = both.split(" | "), meth = text.pop()
	if (!meth) return client.q.cmdthr(msg, "Invalid arguments. You need to provide some methods.")
	if (text.length == 0) return client.q.cmdthr(msg, "You need to provide text before the pipe | character.")
	text = text.join(" | ")
	meth = meth.split(" ")
	if (meth.length > 10) return client.q.cmdthr(msg, "Too many methods were given! (> 10)")
	while(meth[0]) {
		let s = meth.shift()
		let c = s.split("(")[0]
		let pn = parseInt(s.split("(")[1])
		if (isNaN(pn)) pn = 1
		if (pn > 10) pn = 10
		switch(c) {
			case "aest":
			text = [...text].join(" ".repeat(pn))
			break

			case "clap":
			text = text.split(" ").join(" 👏 ")
			break

			case "rev":
			text = [...text].reverse().join("")
			break

			case "upper":
			text = text.toUpperCase()
			break

			case "lower":
			text = text.toLowerCase()
			break

			case "ita":
			text = `*${text}*`
			break

			case "bold":
			text = `**${text}**`
			break

			case "code":
			text = `\`${text}\``
			break
			
			case "drag":
			text = [...text]
			let drag = ""
			for (let i of text) drag += i.repeat(pn)
			text = drag
			break

			case "circle":
			text = text.replace(/[a-z]/g, function(char) {
				return String.fromCharCode(char.charCodeAt() + 9327) + " "
			})
			text = text.replace(/[A-Z]/g, function(char) {
				return String.fromCharCode(char.charCodeAt() + 9300) + " "
			})
			break

			case "regind":
			let regind = ""
			text = [...text]
			for (let x = 0; x < text.length; x++) regind += (regAr[alph.indexOf(text[x].toLowerCase())] ? (regAr[alph.indexOf(text[x-1] ? text[x-1].toLowerCase() : undefined)] ? "" : " ") + regAr[alph.indexOf(text[x].toLowerCase())] + " " : text[x])
			text = regind.trim()
			break

			case "mock":
			let mock = ""
			text = [...text]
			for (let x = 0; x < text.length; x++) mock += (text[x] == 'i' ? 'i' : Math.round(Math.random()) == 1 ? text[x].toUpperCase() : text[x].toLowerCase())
			text = mock
			break
		}
		if (text.length > 800) text = text.slice(0, 800)
	}
	text = client.q.clean(text)
	client.q.cmdd(msg, text)
}
exports.cat = "strp"
exports.cd = 6000
exports.args = ["text | methods(number"]
exports.desc = "Iterative string processing command. Separate text and methods using the pipe character | between spaces. Methods:\n*aest(number* : like the `aest const` command.\n*clap* : Adds a clap between each word.\n*rev* : Reverse string.\n*upper*,*lower* : Cases.\n*ita* : Italic.\n*bold* : Bold.\n*code* : Wraps the string around a pair of backticks.\n*drag(number* : Repeats each character for a number of times.\n*regind* : Turns any character belonging to the modern English alphabet into a regional indicator emoji containing the same letter.\n*circle* : Same as `regind` but converts letters to circled letters.\n*mock* : Random capitalisation engine.\n\nAn example: Doing `str bottom text | aest(2 upper code ita bold`\n❯ ***​`B  O  T  T  O  M     T  E  X  T`***​"