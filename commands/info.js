module.exports = {
	run: async function () {
		let time = process.uptime(), hrs = Math.floor(time / 3600), mins = Math.floor((time - hrs * 3600) / 60)
		return {
			content: client.config.about + `\nCurrently serving ${client.guilds.size} servers and ${client.users.size} users.\nMemory usage: approximately ${Math.floor(process.memoryUsage().rss / 1024 / 1024)}MiB\nUptime: ${hrs} hour(s) and ${mins} minute(s).`
		}
	},
	cat: 'info',
	desc: 'Shows information about the bot.',
	aliases: ['about']
}