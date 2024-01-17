import joi from 'joi';
import db from '../databases/models/index.js';
const { User, Op } = db;
const passwordRegex = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

const commonValidators = {
	email: joi.string().email({ minDomainSegments: 2 }),
	userName: joi.string(),
	name: joi.string(),
	password: joi.string(),
	confirmPassword: joi.string().required(),
	avatar: joi.string(),
	role: joi.string(),
	theme: joi.string(),
};

export const registrationValidator = async (data) => {
	try {
		const schema = joi.object({
			email: commonValidators.email.required(),
			name: commonValidators.name.optional(),
			userName: commonValidators.userName.required(),
			password: commonValidators.password
				.pattern(new RegExp(passwordRegex))
				.messages({
					'string.pattern.base': 'Password must be at least eight characters, one uppercase letter, one lowercase letter, one number and one special character.',
				})
				.required(),
			confirmPassword: commonValidators.confirmPassword.valid(data.password).messages({
				'any.only': 'confirm password does not match',
				'any.required': 'confirm password is required',
			}),
			avatar: commonValidators.avatar.optional(),
			role: commonValidators.role.optional(),
			// theme: commonValidators.theme.required(),
		});
		const validatedData = await schema.validateAsync(data);

		const checkEmail = await User.findOne({ where: { email: validatedData?.email } });
		if (checkEmail) {
			return [{ status: 400, data: [], error: { message: 'Email already exist !' } }, null];
		}

		const checkUserName = await User.findOne({ where: { userName: validatedData?.userName } });
		if (checkUserName) {
			return [{ status: 400, data: [], error: { message: 'User name already exist !' } }, null];
		}
		return [null, validatedData];
	} catch (e) {
		if (e.details) {
			const errRes = {
				status: 400,
				data: [],
				error: { message: e.details[0].message },
			};
			return [errRes, null];
		}
		return [{ status: 500, data: [], error: { message: 'Something went wrong !', reason: e.message } }, null];
	}
};

export const loginValidator = async (data) => {
	try {
		const schema = joi.object({
			email: commonValidators.email.required(),
			password: commonValidators.password.required(),
		});
		return [null, await schema.validateAsync(data)];
	} catch (e) {
		if (e.details) {
			const errRes = {
				status: 400,
				data: [],
				error: { message: e.details[0].message },
			};
			return [errRes, null];
		}
		return [{ status: 500, data: [], error: { message: 'Something went wrong !', reason: e.message } }, null];
	}
};

export const checkUserNameAvailabilityValidator = async (data) => {
	try {
		const schema = joi.object({
			userName: commonValidators.userName.required(),
		});
		return [null, await schema.validateAsync(data)];
	} catch (e) {
		if (e.details) {
			const errRes = {
				status: 400,
				data: [],
				error: { message: e.details[0].message },
			};
			return [errRes, null];
		}
		return [{ status: 500, data: [], error: { message: 'Something went wrong !', reason: e.message } }, null];
	}
};
export const sendEmailOtpValidator = async (data) => {
	try {
		const schema = joi.object({
			email: commonValidators.email.required(),
			name: commonValidators.name.optional(),
			userName: commonValidators.userName.required(),
			password: commonValidators.password
				.pattern(new RegExp(passwordRegex))
				.messages({
					'string.pattern.base': 'Password must be at least eight characters, one uppercase letter, one lowercase letter, one number and one special character.',
				})
				.required(),
			confirmPassword: commonValidators.confirmPassword.valid(data.password).messages({
				'any.only': 'confirm password does not match',
				'any.required': 'confirm password is required',
			}),
			avatar: commonValidators.avatar.optional(),
			role: commonValidators.role.optional(),
		});
		const validatedData = await schema.validateAsync(data);

		const checkEmail = await User.findOne({ where: { email: validatedData?.email } });
		if (checkEmail) {
			return [{ status: 400, data: [], error: { message: 'Email already exist !' } }, null];
		}

		const checkUserName = await User.findOne({ where: { userName: validatedData?.userName } });
		if (checkUserName) {
			return [{ status: 400, data: [], error: { message: 'User name already exist !' } }, null];
		}
		return [null, validatedData];
	} catch (e) {
		if (e.details) {
			const errRes = {
				status: 400,
				data: [],
				error: { message: e.details[0].message },
			};
			return [errRes, null];
		}
		return [{ status: 500, data: [], error: { message: 'Something went wrong !', reason: e.message } }, null];
	}
};

export const verifyEmailOtpValidator = async (data) => {
	try {
		const schema = joi.object({
			sentOtp: joi.string().required(),
			otp: joi.string().required(),
		});
		return [null, await schema.validateAsync(data)];
	} catch (e) {
		if (e.details) {
			const errRes = {
				status: 400,
				data: [],
				error: { message: e.details[0].message },
			};
			return [errRes, null];
		}
		return [{ status: 500, data: [], error: { message: 'Something went wrong !', reason: e.message } }, null];
	}
};
