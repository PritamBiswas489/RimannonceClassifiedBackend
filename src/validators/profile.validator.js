import joi from 'joi';
import db from '../databases/models/index.js';
const { User, Op } = db;
const commonValidators = {
	// email: joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
	userName: joi.string(),
	name: joi.string(),
	profileImg: joi.string(),
};

export const editProfileValidator = async (data, userId) => {
	try {
		const schema = joi.object({
			name: commonValidators.name.optional(),
			userName: commonValidators.userName.required(),
			profileImg: commonValidators.profileImg.required(),
		});
		const validatedData = await schema.validateAsync(data);

		const checkUserName = await User.findOne({ where: { userName: validatedData?.userName, id: { [Op.ne]: userId } } });
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
