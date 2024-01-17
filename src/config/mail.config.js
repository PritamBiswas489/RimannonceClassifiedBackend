import { createTransport } from 'nodemailer';
import './environment.js';

const { MAIL_HOST, MAIL_PORT, MAIL_USER, MAIL_PASS } = process.env;

export const smtpConnection = () => {
	const mailPort = Number(MAIL_PORT);
	const mailConfig = {
		// pool: true,
		host: MAIL_HOST,
		port: mailPort,
		auth: {
			user: MAIL_USER,
			pass: MAIL_PASS,
		},
	};
	if (mailPort === 465) {
		mailConfig.secure = true;
	}
	const con = createTransport(mailConfig);
	// con.verify(function (error, success) {
	// 	if (error) {
	// 		console.log(error);
	// 	} else {
	// 		console.log('Server is ready to take our messages');
	// 	}
	// });
	return con;
};
