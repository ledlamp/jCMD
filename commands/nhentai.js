// This ultra super spaghetti code is intentionally left uncommented, because hell do I not have the courage to do so

function extractTags(body) { return body.match(/<div class="tag-container field-name ">Tags:(.*?)<\/div>/)[1].replace(/\((\d|,)*?\)/g, '').replace(/<.*?>/g, ';').split(/ *;+/).slice(1, -1) }
function extractLangs(body) { return body.match(/<div class="tag-container field-name ">Languages:(.*?)<\/div>/)[1].replace(/\((\d|,)*?\)/g, '').replace(/<.*?>/g, ';').split(/ *;+/).slice(1, -1) }
function extractArtists(body) { return body.match(/<div class="tag-container field-name ">Artists:(.*?)<\/div>/)[1].replace(/\((\d|,)*?\)/g, '').replace(/<.*?>/g, ';').split(/ *;+/).slice(1, -1) }
function extractTitle(body) { return body.match(/<meta itemprop="name" content="(.+)" \/>/)[1] }
function similarity(s1, s2) { let longer = s1; let shorter = s2; if (s1.length < s2.length) { longer = s2; shorter = s1 } if (longer.length === 0) { return 1.0 } return (longer.length - editDistance(longer, shorter)) / parseFloat(longer.length) } function editDistance(s1, s2) { s1 = s1.toLowerCase(); s2 = s2.toLowerCase(); let costs = []; for (let i = 0; i <= s1.length; i += 1) { let lastValue = i; for (let j = 0; j <= s2.length; j += 1) { if (i === 0) { costs[j] = j } else if (j > 0) { let newValue = costs[j - 1]; if (s1.charAt(i - 1) !== s2.charAt(j - 1)) { newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1 } costs[j - 1] = lastValue; lastValue = newValue } } if (i > 0) { costs[s2.length] = lastValue } } return costs[s2.length] }

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
	'vanilla',
	'leg lock'
]

module.exports = {
	run: async function (msg, p) {
		let code = p[0]
		if (isNaN(parseInt(code))) throw new UserInputError('You need to provide a number.')
		msg.channel.startTyping()
		let res = await fetch('https://nhentai.net/g/' + code)
		msg.channel.stopTyping()
		if (res.status !== 200) throw new UserInputError('Doujinshi not found. Check whether you have given the correct name.')

		let
			body = (await res.text()).replace(/(\n+([ \t])*)/g, ''),
			title = extractTitle(body),
			tags = extractTags(body), saidTags = false,
			langs = extractLangs(body),
			artists = extractArtists(body),
			response = ''

		let abandon = false
		for (let i of forbiddenTitles) if (title === i || title.startsWith(i)) {
			abandon = true
			break
		}
		let culture = [], isCultured = false
		for (let i of cultureTags) if (tags.includes(i)) {
			isCultured = true
			culture.push(i)
		}
		let isLoli = tags.includes('lolicon')
		let ara = tags.includes('shotacon')

		if (code !== '177013' && similarity('177013', code) > 0.8 && isLoli) response += '\nDid you perchance mean **177013** for some good, clean, non-loli fun?\nBut I\'ve got to do my job, so...\n'
		if (isLoli) {
			response += `\n**Tags: *lolicon***\n	${abandon || isCultured || ara ? 'FBI OPE--' : 'FBI OPEN UP!'}`
			saidTags = true
		}
		if (isCultured) {
			response += `\n**${saidTags ? 'Also tags' : 'Tags'}: *${culture.join(', ')}***\n	I see you are a man of culture as well.`
			saidTags = true
		}
		if (artists.includes('michiking')) {
			response += `\n**Artists: *michiking***\n	oh ho you are indeed a man of culture cOUGH COUGH`
		}
		if (abandon) response += `\nWait...\n**Title: *${title}***\n	Abandon all hope, ye who enter here`
		if (ara) {
			response += `\n**${saidTags ? 'Also tags' : 'Tags'}: *shotacon***\n	***Ahhhh yes. Vvvveeeerrryyy yyeeeeeeeessss.***`
			saidTags = true
		}
		if (!langs.includes('english') && isLoli) response += '\n**Languages: *Not English***\n	Does it look like that I can read moon runes? No matter where the hell you live, here in \'murica we protect the lolis. Take them away boys!'
		if (response === '') response += '\nOh. Oh wow. Something actually normal this time. I am proud that you have such a fine taste in this wild realm of art. Or maybe you are just a normie, I don\'t know. ¯\\_(ツ)_/¯'
		return { content: `\n*\`\`\`${code}\`\`\`*` + response }
	},
	args: ['doujinshi id'], argCount: 1,
	cat: 'fun',
	desc: 'Infinite doujinshi analysis fun! Batteries and FBI not included.\nThis command is somewhat the product of reverse engineering u/Loli-Tag-Bot.',
	nsfw: true,
	cd: 2000
}