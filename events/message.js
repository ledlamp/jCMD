module.exports = async function (msg) {
	// Handle the message
	client.handler(msg, function (content, options, traces) {
		// Reply to the user
		client.util.done(msg, content, options)
		.then(function (m) {
			// If the reply is successful, we add the output along with other info to the binds map
			if (m) {
				client.binds.set(msg.author.id, {
					input: msg.id,
					output: m,
					traces,
					times: 0,
					timer: client.setTimeout(function () {client.binds.delete(msg.author.id)}, client.config.maxEditTime) // This removes itself from the map to limit the max time between the command execution and the next command edit / deletion
				})
			}
		})
	}, function (content, options, traces) {
		client.util.throw(msg, content, options)
		.then(function (m) {
			if (m) {
				client.binds.set(msg.author.id, {
					input: msg.id,
					output: m,
					traces,
					times: 0,
					timer: client.setTimeout(function () {client.binds.delete(msg.author.id)}, client.config.maxEditTime)
				})
			}
		})
	})
}