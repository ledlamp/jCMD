function deepHelp(client, msg, obj, p, his) {
	if (obj.run) {
		let x = 0, pre = "", suf = "", fields = [];
		if (obj.args) {fields[x] = {name: "Usage", value: `${client.q.getPre(msg)}${his} ${client.q.argSq(obj.args)}`}; x++}//pre = client.q.argSq(obj.args);
		if (obj.own) suf = " ***Can only be executed by the bot owner.***";
		if (obj.cd) {toSecs = parseFloat((obj.cd / 1000).toFixed(1)); fields[x] = {name: "Cooldown", value: `${toSecs} second${toSecs == 1 ? '' : "s"}`}; x++}
		if (obj.perm) {fields[x] = {name: "User permissions", value: client.q.permName(obj.perm)}; x++;}
		if (obj.botPerm) {fields[x] = {name: "Bot permissions", value: client.q.permName(obj.botPerm)}; x++;}
		client.q.cmdd(msg, client.q.mkEmbed("❯ Help on "+ client.q.getPre(msg) + his, "❯ " + pre + " " + obj.desc + " " + suf, fields));
	}
	else {
		if (Object.keys(obj.subCmd).indexOf(p[0]) == -1) {
			let fields = [];
			for (key = 0; key <= Object.keys(obj.subCmd).length - 1; key++) {
				let prop = Object.keys(obj.subCmd)[key];
				fields[key] = {name: prop, value: ""};
				if (obj.subCmd[prop].args) fields[key].value += client.q.argSq(obj.subCmd[prop].args);
				fields[key].value += obj.subCmd[prop].desc;
			}
			client.q.cmdd(msg, client.q.mkEmbed("❯ Help on " + client.q.getPre(msg) + his, "❯ " + obj.desc + " Subcommands:", fields));
		} else {
			subc = p.shift();
			deepHelp(client, msg, obj.subCmd[subc], p, his + " " + subc);
		}
	}
}
exports.run = async function(client, msg, cmd) {
	let pr = client.q.getPre(msg);
	if (!cmd[0] || !client.commands.get(cmd[0])) client.q.cmdd(msg, client.q.mkEmbed(`❯ Prefix: ${pr ? pr : '(none in DMs)'} - Help`, "❯ Available commands, by category:", client.helpFields));
	else {let c = cmd.shift(); deepHelp(client, msg, client.commands.get(c), cmd, c)}
}
exports.cat = "info";
exports.cd = 3000;
exports.desc = "Shows available commands or information about mentioned command.\nSomehow, this is one of the most complex commands ever written for this bot. Part of it even lies in the bot's main code file.";
