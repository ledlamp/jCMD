exports.run = async function(client, msg, msgP) {
	min = parseInt(msgP[0]); max = parseInt(msgP[1]);
	if (min >= max) client.q.cmdthr(msg, `Invalid numbers! Make sure min < max and try again.`);
	else {
		rnd = Math.round(Math.random() * (max - min)) + min;
		if(!isNaN(rnd)) client.q.cmdd(msg, `Your random number is ${rnd}.`);
		else client.q.cmdw(msg, "Your random number is... uhh... you didn't give actual numbers. Okay.");
	}
}
exports.cat = "util";
exports.args = ["min", "max"];
exports.desc = "Gives a random number between (min) and (max).";
