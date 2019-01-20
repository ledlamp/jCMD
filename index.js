"use strict";
const Discord = require("discord.js");
const Enmap = require("enmap");
const fs = require("fs");
const client = new Discord.Client(); client.config = require("./config.json");

var stdin = process.openStdin(); stdin.on("data", function (input) { let msg = input.toString(); try { console.log(require('util').inspect(eval(msg))) } catch (err) { if (err) console.log(err) } });

fs.readdir("./events/", (err, files) => {
	if (err) return console.error(err);
	files.forEach(file => {
		const event = require(`./events/${file}`);
		let eventName = file.split(".")[0];
		client.on(eventName, event.bind(null, client));
	});
});

client.perms = { PERMS: require('./language/perms.json').perms, PERMNAMES: require('./language/perms.json').names }

client.gConfig = {
	configs: {},
	class: class guildConfig {
		constructor(name, prefix) {
			this.name = name;
			this.prefix = prefix;
		}
	},
	load: function () {
		let cf = fs.readdirSync('./data/guilds', { withFileTypes: false });
		if (cf.length !== 0)
			for (let sPos = 0; sPos < cf.length; sPos++) this.configs[cf[sPos].split(".json")[0]] = require(`./data/guilds/${cf[sPos]}`);
	},
	write: async function (msg, name, cusFunc) {
		let check = true, gConfig = this.configs[msg.guild.id];
		if (!gConfig) gConfig = new this.class(msg.guild.name);
		cusFunc(msg, gConfig);
		for (let oof of Object.keys(gConfig)) { if (gConfig[oof] == undefined || gConfig[oof] == "" || Object.keys(gConfig[oof]) == []) delete gConfig[oof]; }
		if (Object.keys(gConfig).length < 2) {
			delete this.configs[msg.guild.id];
			return fs.unlink(`./data/guilds/${msg.guild.id}.json`, (err) => {
				if (err) client.q.cmdthr(msg, "This server doesn't even have a config file!");
				else client.q.cmdd(msg, "The server has no custom config so its config file is gone! Congrats!");
			});
		} else {
			this.configs[msg.guild.id] = gConfig;
			fs.writeFile(`./data/guilds/${msg.guild.id}.json`, JSON.stringify(gConfig), (err) => { if (err) { check = false; throw err }; });
		}
		if (check) return client.q.cmdd(msg, `${name} successfully saved!`);
	}
}

client.q = {
	getPre: function (msg) {
		if (msg.channel.type == "dm") return "";
		if (client.gConfig.configs[msg.guild.id] && client.gConfig.configs[msg.guild.id].prefix) return client.gConfig.configs[msg.guild.id].prefix;
		return client.config.prefix;
	},
	cmdthr: async function (msg, reply, opt) { msg.react('❌'); return msg.channel.send(reply, opt) },
	cmdw: async function (msg, reply, opt) { msg.react('⚠'); return msg.channel.send(reply, opt) },
	cmdd: async function (msg, reply, opt) { msg.react('✅'); return msg.channel.send(reply, opt) },
	mkEmbed: function (title, desc, fields, image) { return { embed: { color: client.config.embedColor, title: title, description: desc, fields: fields, image: image ? { url: image } : undefined } } },
	permName: function (perm) { if (typeof perm == "object") { let str = ""; for (let res of perm) str += client.perms.PERMNAMES[client.perms.PERMS.indexOf(res)] + ", "; return str.slice(0, str.length - 2); } else return client.perms.PERMNAMES[client.perms.PERMS.indexOf(perm)] },
	getUser: function (thing) {
		let user = msg.mentions.users.first();
		if (!user) user = client.users.find(user => user.username.toLowerCase().indexOf(thing.toLowerCase()) > -1);
		if (!user) user = client.users.find(user => user.tag.toLowerCase().indexOf(thing.toLowerCase()) > -1);
		if (!user) user = client.users.find(user => user.id == thing);
		return user;
	},
	getMember: function (msg, thing) {
		let member = msg.mentions.members.first();
		if (!member) member = msg.guild.members.find(member => member.nickname ? member.nickname.toLowerCase().indexOf(thing.toLowerCase()) > -1 : false);
		if (!member) member = msg.guild.members.find(member => member.user.username.toLowerCase().indexOf(thing.toLowerCase()) > -1);
		if (!member) member = msg.guild.members.find(member => member.user.tag.toLowerCase().indexOf(thing.toLowerCase()) > -1);
		if (!member) member = msg.guild.members.find(member => member.user.id == thing);
		return member;
	},
	argSq: function (argStr) { let str = ""; for (let aPos of argStr) { str += `[${aPos}] `; } return str; },
	clean: function (text) { if (typeof (text) === "string") return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203)); else return text; }
}

client.commands = new Enmap();
fs.readdir("./commands/", (err, files) => {
	if (err) return console.error(err);
	files.forEach(file => {
		if (!file.endsWith(".js")) return;
		let props = require(`./commands/${file}`);
		let commandName = file.split(".")[0];
		client.commands.set(commandName, props);
	});
	client.helpFields = []; {
		class HCatObj {
			constructor(name, commands) {
				this.name = name;
				this.commands = commands || [];
			}
		}
		let helpObj = {
			info: new HCatObj("Help & Information"),
			util: new HCatObj("Utility"),
			mod: new HCatObj("Moderation"),
			fun: new HCatObj("Fun"),
			strp: new HCatObj("String processing & manipulation"),
			config: new HCatObj("Configuration"),
			maint: new HCatObj("Maintenance")
		}
		client.commands.map((a, b) => { if (a.cat) helpObj[a.cat].commands.push(b) });
		let x = 0;
		for (let i of Object.keys(helpObj)) {
			client.helpFields[x] = { name: helpObj[i].name, value: "" };
			for (let ii = 0; ii < helpObj[i].commands.length; ii++) { client.helpFields[x].value += "`" + helpObj[i].commands[ii] + "`"; if (ii !== helpObj[i].commands.length - 1) client.helpFields[x].value += ", " }
			if (client.helpFields[x].value !== "") x++;
		}
	}
});

client.cd = {
	userOnCD: [],
	addCooldown: function (id, interval = 2000) { this.userOnCD.unshift(id); setTimeout(function () { let index = client.cd.userOnCD.indexOf(id); if (index > -1) client.cd.userOnCD.splice(index, 1) }, interval) }
}

client.rnd = {
	plays: require('./language/playArray.json'), playHtr: [],
	play: async function () {
		let playPick, playFlag = true;
		while (playFlag) {
			playPick = Math.round(Math.random() * (this.plays.text.length - 1));
			if (!this.playHtr.includes(playPick)) playFlag = false;
		}
		while (this.playHtr.length > 20) this.playHtr.shift();
		this.playHtr.push(playPick);
		client.user.setActivity(this.plays.text[playPick]);
	},
	insults: require('./language/insultArray.json'), insultHtr: [],
	insultGet: function () {
		let inPick, inFlag = true;
		while (inFlag) {
			inPick = Math.round(Math.random() * (this.insults.text.length - 1));
			if (!this.insultHtr.includes(inPick)) inFlag = false;
		}
		while (this.insultHtr.length > 20) insultHtr.shift();
		this.insultHtr.push(inPick);
		return this.insults.text[inPick];
	}
}

client.on('error', err => console.log(err.message));
client.gConfig.load();
client.login(client.config.token);
const DBL = require("dblapi.js"); const dbl = new DBL(client.config.DBLtoken, client); dbl.on('posted', () => { console.log('Server count posted to DBL.') })