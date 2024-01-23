import joi from 'joi';
import db from '../databases/models/index.js';
const { User, Op } = db;
const commonValidators = {
	phone: joi.string(),
	name: joi.string(),
	email: joi.string(),
};

export const editProfileValidator = async (data, userId) => {
	try {
		const schema = joi.object({
			name: commonValidators.name.required(),
			email: commonValidators.email.required(),
			phone: commonValidators.phone.required(),
		});
		const validatedData = await schema.validateAsync(data);

		const checkEmail = await User.findOne({ where: { email: validatedData?.email, id: { [Op.ne]: userId } } });
		if (checkEmail) {
			return [{ status: 400, data: [], error: { message: 'Email already exist!' } }, null];
		}
		const checkPhone = await User.findOne({ where: { phone: validatedData?.phone, id: { [Op.ne]: userId } } });
		if (checkPhone) {
			return [{ status: 400, data: [], error: { message: 'Phone already exist!' } }, null];
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
