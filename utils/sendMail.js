const nodemailer = require("nodemailer");
const sendMail = async (infos) => {
	const transport = nodemailer.createTransport({
		host: "sandbox.smtp.mailtrap.io",
		port: 2525,
		auth: {
			user: "774e27a7e2a469",
			pass: "4a3fc3e5cfdc5d",
		},
	});
	const options = {
		from: "bader zaouich",
		to: infos.to,
		subject: infos.subject,
		text: infos.text,
	};

	await transport.sendMail(options);
};
module.exports = sendMail;
