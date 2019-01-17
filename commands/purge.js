exports.run = async function(client, msg, p) {
	deleteCount = parseInt(p[0], 10) + 1;
	if (isNaN(deleteCount) || deleteCount < 2 || deleteCount > 1000) return client.q.cmdthr(msg, "Please provide a number between 1 and 999 for the number of messages to delete.");
	stop = false;
	while (deleteCount > 100) {
		fetched = await msg.channel.fetchMessages({
			limit: 100
		});
		if (stop) break;
		msg.channel.bulkDelete(fetched)
			.catch(error => {
				client.q.cmdthr(msg, `Couldn't delete messages. Error: ${error.message}`);
				stop = true;
			});
		deleteCount -= 100;
	}
	if (stop) return;
	else {
		fetched = await msg.channel.fetchMessages({
			limit: deleteCount
		});
		msg.channel.bulkDelete(fetched)
			.catch(error => client.q.cmdthr(msg, `Couldn't delete messages. Error: ${error.message}`));
	}
}
exports.cat = "mod";
exports.reqGuild = true;
exports.perm = "MANAGE_MESSAGES";
exports.botPerm = "MANAGE_MESSAGES";
exports.args = ["number, 1 -> 999"];
exports.desc = "Deletes the most recent (number) messages, plus the message containing the command.";
