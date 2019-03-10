module.exports = {
	run: async function (msg) {
		return {content: client.lang.paste()}
	},
	cat: 'fun',
	desc: 'Spits out a copypasta that shows up when ya haxxors try doing `eval`.'
}