module.exports = {
	run: async function (msg) {
		msg.channel.startTyping()
		return fetch('http://api.cutegirls.moe/json').then(resp => resp.json()).then(function (obj) {
			msg.channel.stopTyping()
			if (obj.status === 200) return {
				options: {embed: client.util.mkEmbed(undefined, `[**${obj.data.title}**](${obj.data.link}) by [u/**${obj.data.author}**](https://reddit.com/u/${obj.data.author}) from [r/**${obj.data.sub}**](https://reddit.com/r/${obj.data.sub})`, undefined, obj.data.image)}
			}
			else {
				throw new UserInputError(`HTTP status of cutegirls API was: ` + obj.status)
			}
		})
	},
	cat: 'fun',
	cd: 3000,
	desc: 'Fetches a random waifu image from Reddit.'
}