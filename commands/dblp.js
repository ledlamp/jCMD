exports.run = async function(client, msg, p) {
	let user = client.q.getUser(msg, p[0])
	if (user == null) user = {id: p[0], tag: p[0]}
	require('request')({url: 'https://discordbots.org/api/users/' + user.id, json: true}, function (error, response, body) {
		if (!error && !body.error) client.q.cmdd(msg, client.q.mkEmbed(`DBL profile of ${user.tag}`, `https://discordbots.org/user/${user.id}`, []))
		else client.q.cmdthr(msg, "User not found in DBL, or something with reVerb's potato Internet connection went wrong.")
	}).auth(null, null, true, client.config.DBLtoken)
}
exports.cat = "info"
exports.cd = 6000
exports.args = ["user ID/mention/username/tag"]
exports.desc = "Shows a link to invite the bot to your server."
