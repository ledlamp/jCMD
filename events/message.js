module.exports = (client, msg) => {
	if (msg.author.bot) return;
	let command, args, isDM = false;
	if (msg.channel.type == "dm") {
		isDM = true;
		args = msg.content.split(" ");
	}
	else if (msg.content.startsWith(`<@${client.user.id}> `)) {
		args = msg.content.slice(`<@${client.user.id}> `.length).trim().split(/ +/g);
		msg.mentions.users.delete(msg.mentions.users.first().id);
	}
	else if (msg.content.startsWith(client.q.getPre(msg))) args = msg.content.slice(client.q.getPre(msg).length).trim().split(/ +/g);
	else return;
	command = args.shift();
  const cmdst = client.commands.get(command);
	if (!cmdst) return;
	if (client.cd.userOnCD.indexOf(msg.author.id) !== -1) return msg.channel.send(`Slow down, take it easy.`);
	function deepCmd(obj, p, his) {
		if (obj.run) {
			if (obj.reqGuild && isDM) return client.q.cmdthr(msg, "You can only do that command in a server text channel.");
			if (obj.own && (msg.author.id !== client.config.ownerID)) return client.q.cmdthr(msg, client.rnd.insultGet());
			if (obj.args && (p.length < obj.args.length)) {if (!obj.noParse) return client.q.cmdthr(msg, "Not enough arguments. Arguments needed: " + client.q.argSq(obj.args)); else {noParse = true; return obj.noParse(client, msg)}}
			if (obj.perm && !msg.channel.permissionsFor(msg.member).has(obj.perm)) return client.q.cmdthr(msg, "Insufficient permissions. You are missing `" + client.q.permName(obj.perm) + "`.");
			if (obj.botPerm && !msg.channel.permissionsFor(msg.guild.member(client.user)).has(obj.perm)) return client.q.cmdthr(msg, "Insufficient permissions for the bot. The bot is missing `" + client.q.permName(obj.botPerm) + "`.");
			try {obj.run(client, msg, args)} catch (err) {console.log(msg.content, " | Error: ", err)};
			if(msg.author.id !== client.config.ownerID) client.cd.addCooldown(msg.author.id, obj.cd);
		}
		else {
			if (!p[0]) return client.q.cmdthr(msg, `You need to define a subcommand. Do \`${client.q.getPre(msg)}help ${his}\` for more information.`);
			subc = p.shift();
			let clip = subc.length > 15 ? subc.slice(0, 15) + "..." : subc;
			if (Object.keys(obj.subCmd).indexOf(subc) == -1) return client.q.cmdthr(msg, `Invalid subcommand \`${clip}\`. Do \`${client.q.getPre(msg)}help ${his}\` for more information.`);
			deepCmd(obj.subCmd[subc], p, his + " " + subc);
		}
	}
	deepCmd(cmdst, args, command);
};
