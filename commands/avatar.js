exports.run = async function(client, msg, p) {
	let user = client.q.getUser(msg, p[0]);
	if (user == null) client.q.cmdthr(msg, "User not found. Check your spelling/mention/included ID and try again.");
	else {
		client.q.cmdd(msg, client.q.mkEmbed(`Profile picture of **${user.tag}**`, undefined, undefined, user.avatarURL));
	}
}
exports.cat = "util";
exports.cd = 3000;
exports.args = ["user ID/mention/username/tag"];
exports.desc = "Gets the mentioned user's profile picture.";
