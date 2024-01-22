import '../config/environment.js';
import { registrationValidator, loginValidator, checkUserNameAvailabilityValidator, sendEmailOtpValidator, verifyEmailOtpValidator } from '../validators/login.validator.js';
import { hashStr, compareHashedStr, generateToken } from '../libraries/auth.js';
import db from '../databases/models/index.js';
import { smtpConnection } from '../config/mail.config.js';
import { resolve as pathResolve, dirname, join as pathJoin } from 'path';
import { generateHtmlTemplate, generateOtp } from '../libraries/utility.js';

const { User, Op } = db;
const { ACCESS_TOKEN_SECRET_KEY, REFRESH_TOKEN_SECRET_KEY, JWT_ALGO, ACCESS_TOKEN_EXPIRES_IN, REFRESH_TOKEN_EXPIRES_IN, MAIL_FROM, NODE_ENV } = process.env;

export const loginUsingUserId = async (request) => {
	
	try {
		const { payload } = request;
		const {user_id} = payload;
		const checkUser = await User.findOne({
			where: { id: user_id },
		});
		if (!checkUser) {
			return { status: 400, data: [], error: { message: 'Invalid user account !' } };
		}
		const jwtPayload = {
			id: checkUser.id,
			email: checkUser.email,
			role: checkUser.role,
			avatar: checkUser.avatar,
			name: checkUser.name,
			userName: checkUser.userName,
			// theme: checkUser?.theme,
		};

		const accessToken = await generateToken(jwtPayload, JWT_ALGO, ACCESS_TOKEN_SECRET_KEY, Number(ACCESS_TOKEN_EXPIRES_IN));
		const refreshToken = await generateToken(jwtPayload, JWT_ALGO, REFRESH_TOKEN_SECRET_KEY, Number(REFRESH_TOKEN_EXPIRES_IN));

		return {
			status: 200,
			message: 'Login successful !',
			data: {
				accessToken,
				refreshToken,
			},
		};
	} catch (e) {
		return { status: 500, data: [], error: { message: 'Something went wrong !', reason: e.message } };
	}

}


export const login = async (request) => {
	try {
		const { payload } = request;
		const data = {
			phone: payload.phone,
			password: payload.password,
		};
		const [err, validatedData] = await loginValidator(data);
		if (err) {
			return err;
		}
		const checkUser = await User.findOne({
			where: { phone: validatedData?.phone },
		});

		if (!checkUser) {
			return { status: 400, data: [], error: { message: 'Invalid phone or password !' } };
		}

		const compPass = await compareHashedStr(validatedData?.password, checkUser.password);

		if (!compPass) {
			return { status: 400, data: [], error: { message: 'Invalid phone or password !' } };
		}

		/**
		 ********** token creation **************
		 */
		const jwtPayload = {
			id: checkUser.id,
			email: checkUser.email,
			role: checkUser.role,
			name: checkUser.name,
			phone: checkUser.phone,
		};

		const accessToken = await generateToken(jwtPayload, JWT_ALGO, ACCESS_TOKEN_SECRET_KEY, Number(ACCESS_TOKEN_EXPIRES_IN));
		const refreshToken = await generateToken(jwtPayload, JWT_ALGO, REFRESH_TOKEN_SECRET_KEY, Number(REFRESH_TOKEN_EXPIRES_IN));

		return {
			status: 200,
			message: 'Login successful !',
			data: {
				accessToken,
				refreshToken,
				user: checkUser
			},
		};
	} catch (e) {
		return { status: 500, data: [], error: { message: 'Something went wrong !', reason: e.message } };
	}
};

export const register = async (request) => {
	try {
		const { payload } = request;

		const data = {
			name: payload.name,
			email: payload.email,
			phone: payload.phone,
			password: payload.password,
			confirmPassword: payload.confirmPassword,
			role: payload.role,
		};

		const [err, validatedData] = await registrationValidator(data);
		if (err) {
			return err;
		}

		const afterValidate = {
			name: validatedData.name ?? validatedData.userName,
			email: validatedData.email,
			phone: validatedData.phone,
			password: await hashStr(validatedData?.password),
			role: validatedData?.role ?? 'USER',
		};
		// return {
		// 	data: afterValidate,
		// 	status: 200,
		// 	message: 'User registration successful',
		// };

		const user = await User.create(afterValidate);

		const jwtPayload = {
			id: user.id,
			email: user.email,
			role: user.role,
			name: user.name,
			phone: user.phone,
		};

		const accessToken = await generateToken(jwtPayload, JWT_ALGO, ACCESS_TOKEN_SECRET_KEY, Number(ACCESS_TOKEN_EXPIRES_IN));
		const refreshToken = await generateToken(jwtPayload, JWT_ALGO, REFRESH_TOKEN_SECRET_KEY, Number(REFRESH_TOKEN_EXPIRES_IN));

		return {
			data: {
				accessToken,
				refreshToken,
				user
			},
			status: 200,
			message: 'User registration successful',
		};
	} catch (e) {
		return { status: 500, data: [], error: { message: 'Something went wrong !', reason: e.message } };
	}
};

export const checkUserNameAvailability = async (request) => {
	try {
		const { payload } = request;
		const rawData = {
			userName: payload.userName,
		};
		const [err, validatedData] = await checkUserNameAvailabilityValidator(rawData);
		if (err) {
			return err;
		}
		const checkUserName = await User.findOne({ where: { userName: validatedData?.userName } });
		if (checkUserName) {
			return { status: 400, data: [], error: { message: 'User already exist !' } };
		}
		return { status: 200, data: [], message: 'User not exist !' };
	} catch (e) {
		return { status: 500, data: [], error: { message: 'Something went wrong !', reason: e.message } };
	}
};

export const sendEmailOtp = async (request) => {
	try {
		const { payload } = request;
		const rawData = {
			userName: payload.userName,
			name: payload.name,
			email: payload.email,
			password: payload.password,
			confirmPassword: payload.confirmPassword,
			avatar: payload.avatar,
			role: payload.role,
		};
		const [err, validatedData] = await sendEmailOtpValidator(rawData);
		if (err) {
			return err;
		}

		const connection = smtpConnection();
		const otp = generateOtp();

		const htmlPath =
			NODE_ENV === 'development' ? pathResolve(pathJoin(dirname('./'), 'src/view/email/otp.html')) : pathResolve(pathJoin(dirname('./'), '..', 'src/view/email/otp.html'));
		const htmlToSend = await generateHtmlTemplate(htmlPath, { otp });

		const mailOptions = {
			from: MAIL_FROM,
			to: validatedData.email,
			subject: 'Email Verification',
			html: htmlToSend,
			attachments: [
				{
					filename: 'logo.png',
					path:
						NODE_ENV === 'development'
							? pathResolve(pathJoin(dirname('./'), 'public/images/logo.png'))
							: pathResolve(pathJoin(dirname('./'), '..', 'public/images/logo.png')),
					cid: 'unique@logo', //same cid value as in the html img src
				},
			],
		};
		// console.log(mailOptions);
		connection.sendMail(mailOptions);
		return { status: 200, data: { otp: await hashStr(otp) }, message: 'Otp sent to the email successfully!' };
	} catch (e) {
		return { status: 500, data: [], error: { message: 'Something went wrong !', reason: e.message } };
	}
};

export const verifyEmailOtp = async (request) => {
	try {
		const { payload } = request;
		const rawData = {
			sentOtp: payload.sentOtp,
			otp: payload.otp,
		};

		const [err, validatedData] = await verifyEmailOtpValidator(rawData);
		if (err) {
			return err;
		}

		const comparedOtp = await compareHashedStr(validatedData.otp, validatedData.sentOtp);
		if (!comparedOtp) {
			return { status: 400, data: [], error: { message: 'Otp mismatched !' } };
		}

		return { status: 200, data: [], message: 'Otp matched !' };
	} catch (e) {
		return { status: 500, data: [], error: { message: 'Something went wrong !', reason: e.message } };
	}
};
