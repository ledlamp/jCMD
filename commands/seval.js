const jsInterpreter = require('js-interpreter')

function limRun(code, finishF) {
	let myInterpreter = new jsInterpreter(code)
	let halt = false, memF = false
	for (let i = 0; i < 501; i++) {
		if (i > 500) {
			halt = true
			break
		}
		if (String(myInterpreter.value.data).length > 1000 || myInterpreter.value.data > 32767 || myInterpreter.value.data < -32767) {
			memF = true
			break
		}
		if (!halt && !memF) {
			if (!myInterpreter.step()) break
		}
	}
	finishF(myInterpreter, halt, memF)
}

exports.run = async function(client, msg, p) {
	try {
		limRun(p.join(' '), (interpreter, halt, memF) => {
			if (memF) return client.q.cmdthr(msg, 'Woah, you ran out of memory! Man, was that a memory bomb or something?')
			if (String(interpreter.value.data).length > 800) return client.q.cmdw(msg, 'The returned value is longer than 800 characters.')
			client.q.cmdd(msg, (halt ? 'Step limit of 500 reached. ' : '') + '**Returned:**\n```js\n' + interpreter.value.data + '```')
		})
	} catch (err) {
		client.q.cmdw(msg, '**That didn\'t go well.**\n```js\n' + err + '```')
	}
}
exports.cat = 'util'
exports.cd = 6000
exports.args = ['JavaScript code']
exports.desc = 'Runs given piece of JS (ES5 only!) code in an isolated environment. This command is very limiting - you have little memory, and numbers can only reach a maximum of 32767. Finally, the step limit is 500.'
