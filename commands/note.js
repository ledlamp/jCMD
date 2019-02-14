class noteFile {
	constructor(author, content) {
		this.author = author
		this.content = content
	}
}
exports.subCmd = {
	read: {
		desc: 'Shows the user\'s notepad\'s mentioned section.',
		cd: 3000,
		args: ['section'],
		run: async function(client, msg, p) {
			client.lib.fs.readFile(`./data/notes/${msg.author.id}.json`, (err, data) => {
				if (err) return client.q.cmdthr(msg, 'The file storing your notes doesn\'t exist. Create one by writing one!')
				let note = JSON.parse(data)
				if (Object.keys(note.content).length == 0) return client.q.cmdthr(msg, 'Your notepad is empty. Write something!')
				if (!note.content[p[0]]) return client.q.cmdthr(msg, 'Section does not exist.')
				msg.channel.send(`Memopad section \`${p[0]}\` for **` + msg.author.tag + '**: ```\n' + client.q.clean(note.content[p[0]]) + '\n```').catch(()=>{})
			})
		},
		noParse: async function(client, msg) {
			client.lib.fs.readFile(`./data/notes/${msg.author.id}.json`, (err, data) => {
				if (err) return client.q.cmdthr(msg, 'The file storing your notes doesn\'t exist. Create one by writing one!')
				let note = JSON.parse(data)
				if (Object.keys(note.content).length == 0) return client.q.cmdthr(msg, 'Your notepad is empty. Write something!')
				let noteAll = ''
				for (let key = 0; key < Object.keys(note.content).length; key++) {
					noteAll += Object.keys(note.content)[key] + ': ' + note.content[Object.keys(note.content)[key]]
					if (key != Object.keys(note.content).length - 1) noteAll += '\n'
				}
				msg.channel.send('Memopad for **' + msg.author.tag + '**: ```\n' + noteAll + '\n```').catch(()=>{})
			})
		},
		noParseDesc: 'Shows all sections.'
	},
	write: {
		desc: 'Write to the notepad of the user executing the command.',
		cd: 3000,
		args: ['section', 'text'],
		run: async function(client, msg, p) {
			let text = p.slice(1, p.length).join(' ')
			if (text.length > client.config.noteMaxChar) return client.q.cmdthr(msg, `Your note content is too long! (> ${client.config.noteMaxChar} characters)`)
			let note = new noteFile(msg.author.tag, {})
			try {
				note = require(`./data/notes/${msg.author.id}.json`)
			} catch (err) {
				msg.channel.send('Note file doesn\'t exist creating one...').catch(()=>{})
			}
			if (Object.keys(note.content).length >= client.config.noteMaxSec) return client.q.cmdthr(msg, `You have reached the section limit (${client.config.noteMaxSec}). Delete at least one of them.`)
			note.content[p[0]] = text
			client.lib.fs.writeFile(`./data/notes/${msg.author.id}.json`, JSON.stringify(note), (err) => {
				if (err) throw err
				client.q.cmdd(msg, 'Notes successfully saved!')
			})
		}
	},
	del: {
		desc: 'Delete the mentioned section of the notepad.',
		cd: 3000,
		args: ['section'],
		run: async function(client, msg, p) {
			let note = new noteFile(msg.author.tag, {})
			try {
				note = require(`./data/notes/${msg.author.id}.json`)
			} catch (err) {
				return msg.channel.send('The note file for you doesn\'t exist, which means you have never written a note.').catch(()=>{})
			}
			delete note.content[p[0]]
			if (Object.keys(note.content).length == 0) {
				return client.lib.fs.unlink(`./data/notes/${msg.author.id}.json`, (err) => {
					if (err) client.q.cmdthr(msg, 'You don\'t even have a note file!')
					else client.q.cmdd(msg, 'You now have no sections, so your note file is gone! Congrats!')
				})
			} else client.lib.fs.writeFile(`./data/notes/${msg.author.id}.json`, JSON.stringify(note), (err) => {
				if (err) throw err
				client.q.cmdd(msg, `Section ${p[0]} successfully deleted!`)
			})
		}
	},
	wipe: {
		desc: 'Wipes your entire notepad!! Be careful with this command!',
		cd: 3000,
		run: async function(client, msg) {
			client.lib.fs.unlink(`./data/notes/${msg.author.id}.json`, (err) => {
				if (err) client.q.cmdthr(msg, 'You don\'t even have a note file!')
				else client.q.cmdd(msg, 'Your note file is gone! Tada!')
			})
		}
	}
}
exports.cat = 'util'
exports.desc = 'A memo-like utility which you can store plain text in. Notepads are stored per user, so only you can read and write on your notes.'
