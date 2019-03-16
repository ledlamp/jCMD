module.exports = {
	run: async function (msg, p) {
		msg.channel.send('See you later. Hopefully. ;)').catch(()=>undefined)
		client.destroy().then(()=>require('child_process').spawn('pm2', ['restart','index'])).catch(()=>undefined)
	},
	cat: 'maint',
	own: true,
	desc: 'Destroys the client object then restarts the bot.'
}