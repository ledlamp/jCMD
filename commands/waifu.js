module.exports = {
	run: async function (msg) {
		return fetch('http://api.cutegirls.moe/json').then(resp => resp.json()).then(function (obj) {
			if (obj.status === 200) return {
				options: {embed: client.util.mkEmbed(`**${obj.data.title}** by **${obj.data.author}** from r/**${obj.data.sub}**`, undefined, undefined, obj.data.image)}
			}
			else {
				throw new UserInputError(`HTTP status of cutegirls API was: ` + obj.status)
			}
		})
	},
	cat: 'fun',
	desc: 'Fetches a random waifu image from Reddit.'
}