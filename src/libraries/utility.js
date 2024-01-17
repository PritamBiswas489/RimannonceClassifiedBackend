import handlebars from 'handlebars';
import fs from 'fs';

export const slugify = (str) =>
	str
		.toLowerCase()
		.trim()
		.replace(/[^\w\s-]/g, '')
		.replace(/[\s_-]+/g, '-')
		.replace(/^-+|-+$/g, '');

export const generateHtmlTemplate = async (filePath, replacements) => {
	const source = fs.readFileSync(filePath, 'utf-8').toString();
	const template = handlebars.compile(source);
	const htmlToSend = template(replacements);
	return htmlToSend;
};

export const generateOtp = (digits = 6) => {
	var digits = '0123456789';
	let OTP = '';
	for (let i = 0; i < 6; i++) {
		OTP += digits[Math.floor(Math.random() * 10)];
	}
	return OTP;
};

export const generatePusherChannel = (userId1, userId2) => {
	const ids = [userId1, userId2];
	const sortedId = ids.sort();
	return `presence-channel-${sortedId[0]}-${sortedId[1]}`;
};
