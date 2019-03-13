module.exports = async function (guild) {
	let ch = guild.channels.find(function (channel) {return channel.name.startsWith('general') || channel.name.startsWith('main')})
	if (ch) ch.send(`Thank you for using jCMD!\nMy prefix is \`${client.config.prefix}\`, and you can always configure it anytime. To get started, use the \`${client.config.prefix}help\` command. Additional information for a particular command can be shown by doing \`${client.config.prefix}help [command]\`.\nIf you need help, join our Discord server: https://discord.gg/K9EfuXZ\nHope you have fun!`)
}