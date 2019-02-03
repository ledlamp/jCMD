const fetch = require('node-fetch')

function extractTags(body) { return body.replace(/(\n+( |\t)*)/g, '').match(/<div class="tag-container field-name ">Tags:(.*?)<\/div>/)[1].replace(/\((\d|,)*?\)/g, '').replace(/<.*?>/g, ';').split(/ *;+/).slice(1, -1) }
function extractLangs(body) { return body.replace(/(\n+( |\t)*)/g, '').match(/<div class="tag-container field-name ">Languages:(.*?)<\/div>/)[1].replace(/\((\d|,)*?\)/g, '').replace(/<.*?>/g, ';').split(/ *;+/).slice(1, -1) }
function extractTitle(body) { return body.match(/<meta itemprop="name" content="(.+)" \/>/)[1] }

function similarity(s1, s2) {
	var longer = s1
	var shorter = s2
	if (s1.length < s2.length) {
		longer = s2
		shorter = s1
	}
	var longerLength = longer.length
	if (longerLength == 0) {
		return 1.0
	}
	return (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength)
}

function editDistance(s1, s2) {
	s1 = s1.toLowerCase()
	s2 = s2.toLowerCase()
	var costs = new Array()
	for (var i = 0; i <= s1.length; i++) {
		var lastValue = i
		for (var j = 0; j <= s2.length; j++) {
			if (i == 0) costs[j] = j
			else if (j > 0) {
				var newValue = costs[j - 1]
				if (s1.charAt(i - 1) != s2.charAt(j - 1)) newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1
				costs[j - 1] = lastValue
				lastValue = newValue
			}
		}
		if (i > 0) costs[s2.length] = lastValue
	}
	return costs[s2.length]
}

const forbiddenTitles = [
	'EMERGENCE',
	'Legend of The Meme Queen',
	'Loli in a Box',
	'Hako no Naka no Mii | Mii Inside the Box',
	'Shokusou Shoujo | Tentacle Suit Girl',
	'Pretty Melt',
	'JS★Bokobokorin!',
	'EROGROS'
]
const cultureTags = [
	'armpit sex',
	'bdsm',
	'nakadashi'
]

function checkStatus(res) {
	if (res.ok) {
		return res;
	} else {
		throw MyCustomError(res.statusText);
	}
}

exports.run = async function (client, msg, p) {
	let code = p[0]
	if (!/\b\d+\b/.test(code)) return client.q.cmdthr(msg, 'You need to provide a number.')
	msg.channel.startTyping()
	fetch('https://github.com/').then(res => res.text()).then(body => {
		msg.channel.stopTyping()
		if (body.indexOf('<title>404 - Not Found') !== -1) return client.q.cmdthr(msg, 'Doujinshi not found. Check whether you have given the correct name.')
		let title = extractTitle(body), tags = extractTags(body), langs = extractLangs(body)
		let response = '', initResponse = `\n*\`\`\`${code}\`\`\`*`
		let saidTags = false

		let abandon = false
		for (let i of forbiddenTitles) if (title == i || title.startsWith(i)) {
			abandon = true
			break
		}

		let culture = [], isCultured = false
		for (let i of cultureTags) if (tags.indexOf(i) !== -1) {
			isCultured = true
			culture.push(i)
		}

		let isLoli = false
		if (tags.indexOf('lolicon') !== -1) isLoli = true

		if (code !== '177013' && similarity('177013', code) > 0.8 && isLoli) response += '\nDid you perchance mean **177013** for some good, clean, non-loli fun?\nBut I\'ve got to do my job, so...\n'
		response += initResponse
		if (tags.indexOf('lolicon') !== -1) {
			response += `\n**Tags: *lolicon***\n	${abandon || isCultured ? 'FBI OPE--' : 'FBI OPEN UP!'}`
			saidTags = true
		}
		if (isCultured) {
			response += `\n**${saidTags ? 'Also tags' : 'Tags'}: *${culture.join(', ')}***\n	I see you are a man of culture as well.`
			saidTags = true
		}
		if (abandon) response += `\nWait...\n**Title: *${title}***\n	Abandon hope all ye who enter here`
		if (langs.indexOf('english') == -1 && isLoli) response += `\n**Languages: *Not English***\n	Does it look like that I can read moon runes? No matter where the hell you live, here in 'murica we protect the lolis. Take them away boys!`

		if (response == initResponse) response += `\nOh. Oh wow. Something actually normal this time. I am proud that you have such a fine taste in this wild realm of art.`
		client.q.cmdd(msg, response)
	})
}

exports.args = ['doujinshi id']
exports.cat = 'fun'
exports.desc = 'Infinite doujinshi analysis fun! Batteries and FBI not included.\nThis command is somewhat the product of reverse engineering u/Loli-Tag-Bot.'
exports.nsfw = true