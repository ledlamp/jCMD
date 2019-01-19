exports.run = (client, message, args) => {
	const commandName = args[0];
	if (client.commands.has(commandName)) delete require.cache[require.resolve(`./${commandName}.js`)];
	client.commands.delete(commandName);
	const props = require(`./${commandName}.js`);
	client.commands.set(commandName, props);
	message.channel.send(`\`${commandName}\` successfully loaded!`);
};
exports.cat = "maint";
exports.own = true;
exports.args = ["commmand name"];
exports.desc = "Reloads the specified command.";