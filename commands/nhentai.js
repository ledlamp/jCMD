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
	'Hako no Naka no Mii',
	'Shokusou Shoujo',
	'Pretty Melt',
	'JS★Bokobokorin!',
	'EROGROS'
]
const cultureTags = [
	'armpit sex',
	'bdsm',
	'vanilla'
]

module.exports = {
	run: async function (msg, p) {
		let code = p[0]
		if (!/\b\d+\b/.test(code)) throw new UserInputError('You need to provide a number.')
		msg.channel.startTyping()
		let res = await fetch('https://nhentai.net/g/' + code)
		msg.channel.stopTyping()
		if (res.status !== 200) throw new UserInputError('Doujinshi not found. Check whether you have given the correct name.')
		let body = res.text()

		let title = extractTitle(body), tags = extractTags(body), langs = extractLangs(body)
		let response = '', initResponse = `\n*\`\`\`${code}\`\`\`*`
		let saidTags = false

		let abandon = false
		for (let i of forbiddenTitles) if (title == i || title.startsWith(i)) {
			abandon = true
			break
		}

		let culture = [], isCultured = false
		for (let i of cultureTags) if (tags.includes(i)) {
			isCultured = true
			culture.push(i)
		}

		let isLoli = false
		if (tags.includes('lolicon')) isLoli = true

		if (code !== '177013' && similarity('177013', code) > 0.8 && isLoli) response += '\nDid you perchance mean **177013** for some good, clean, non-loli fun?\nBut I\'ve got to do my job, so...\n'
		response += initResponse
		if (isLoli) {
			response += `\n**Tags: *lolicon***\n	${abandon || isCultured ? 'FBI OPE--' : 'FBI OPEN UP!'}`
			saidTags = true
		}
		if (isCultured) {
			response += `\n**${saidTags ? 'Also tags' : 'Tags'}: *${culture.join(', ')}***\n	I see you are a man of culture as well.`
			saidTags = true
		}
		if (abandon) response += `\nWait...\n**Title: *${title}***\n	Abandon hope all ye who enter here`
		if (!langs.includes('english') && isLoli) response += '\n**Languages: *Not English***\n	Does it look like that I can read moon runes? No matter where the hell you live, here in \'murica we protect the lolis. Take them away boys!'

		if (response == initResponse) response += '\nOh. Oh wow. Something actually normal this time. I am proud that you have such a fine taste in this wild realm of art. Or maybe you are just a normie, I don\'t know. ¯\\_(ツ)_/¯'
		return {content: response}
	},
	args: ['doujinshi id'],
	cat: 'fun',
	desc: 'Infinite doujinshi analysis fun! Batteries and FBI not included.\nThis command is somewhat the product of reverse engineering u/Loli-Tag-Bot.',
	nsfw: true,
	cd: 3000
}