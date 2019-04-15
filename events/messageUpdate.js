module.exports = function (old, msg) {
	let bind = client.binds.get(msg.author.id)
	// Check if the edited message is recorded in the binds map
	if (bind && bind.input === msg.id) {
		client.binds.delete(msg.author.id)
		clearTimeout(bind.timer)
		// We use Promise.all to wait until the client is done removing all its reactions from the message
		if (bind.times < 5) {
			if (bind.traces) bind.traces.map(function (toDelete) {
				if (toDelete.deletable) toDelete.delete().catch(()=>undefined)
			})
			Promise.all(
				// Get the message reactions,
				msg.reactions.filter(function (r) {
					// filter and get only the ones the client has reacted to,
					return r.me
				}).map(function (r) {
					// and remove them from the message, returning a resolved Promise regardless if the client did it or not
					return r.remove().then(function() {return Promise.resolve()}).catch(function() {return Promise.resolve()})
				})
			).then(function () {
				// After all of that, we handle the new command, edit our previous response to the new response and react to the response if needed
				client.handler(msg, function (content, options, traces) {
					bind.output.edit(content, options).then(function (m) {
						client.binds.set(msg.author.id, {
							input: msg.id,
							output: m,
							traces,
							times: bind.times + 1,
							timer: client.setTimeout(function () {client.binds.delete(msg.author.id)}, client.config.maxEditTime)
						})
					})
				}, function (content, options, traces) {
					msg.react('❌').catch(()=>undefined)
					bind.output.edit(content, options).then(function (m) {
						client.binds.set(msg.author.id, {
							input: msg.id,
							output: m,
							traces,
							times: bind.times + 1,
							timer: client.setTimeout(function () {client.binds.delete(msg.author.id)}, client.config.maxEditTime)
						})
					})
				})
			})

		}
	}
}