exports.run = async function(client, msg, p) {
	client.channels.get(client.config.suggestChID).send(client.q.clean(p.join(" ")))
		.catch(error => client.q.cmdthr(msg, `Could not send suggestion. Yell this at reVerb#0001 to fix this: ${error.message}`));
	client.q.cmdd(msg, "Suggestion sent!");
}
exports.cat = "info";
exports.args = ["suggestion"];
exports.cd = 10000;
exports.desc = "Sends suggestions to the support server, so reVerb can have a fun time torturing himself trying to add it.";
