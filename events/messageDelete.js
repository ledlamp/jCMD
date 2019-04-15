module.exports = function (msg) {
	let bind = client.binds.get(msg.author.id)
	// Check if the deleted message is recorded in the binds map
	if (bind) {
		// Delete the bind from the map and clear its timeout
		client.binds.delete(msg.author.id)
		clearTimeout(bind.timer)
		// Delete the output
		bind.output.delete().catch(()=>undefined)
		// Remove all traces of the previous run
		if (bind.traces) bind.traces.map(function (toDelete) {
			if (toDelete.deletable) toDelete.delete().catch(()=>undefined)
		})
	}
}