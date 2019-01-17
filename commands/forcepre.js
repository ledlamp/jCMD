exports.run = async function(client, msg, p) {
	let reset = false;
	if (!p[0]) reset = true;
	client.gConfig.write(msg, "Prefix", function(msg, gConfig) {
		if(reset) delete gConfig.prefix;
		else gConfig.prefix = p[0].trim();
	})
}
exports.cat = "maint";
exports.reqGuild = true;
exports.own = true;
exports.desc = "Like the command `prefix`, but forcefully. Parse nothing to reset the server's custom prefix.";