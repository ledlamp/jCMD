module.exports = {
	run: async function (msg) {
		msg.channel.send('Oh ho ho ha ha, oh ho ho hee hee ha.').catch(()=>{})
		setTimeout(function() {msg.channel.send('Hello there, old chum.').catch(()=>{})}, 1800)
		setTimeout(function() {msg.channel.send('I\'m gnot a gnelf. I\'m gnot a gnoblin.').catch(()=>{})}, 3600)
		setTimeout(function() {msg.channel.send('I\'m a gnome, and you\'ve been GNOOOMED\'!! ' + client.emojis.get('528847384223023104').toString()).catch(()=>{})}, 5400)
	},
	cat: 'fun',
	cd: 5000,
	desc: 'Gnome your chums with this super awesome command!',
	botPerm: 'USE_EXTERNAL_EMOJIS'
}