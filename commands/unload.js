exports.run = (client, message, args) => {
	const commandName = args[0];
	if (!client.commands.has(commandName)) client.q.cmdthr(msg, 'Command not found.');
	delete require.cache[require.resolve(`./${commandName}.js`)];
	client.commands.delete(commandName);
	message.channel.send(`\`${commandName}\` successfully unloaded!`);
};
exports.cat = "maint";
exports.own = true;
exports.args = ["commmand name"];
exports.desc = "Reloads the specified command.";
