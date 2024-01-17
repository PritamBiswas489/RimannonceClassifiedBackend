import joi from 'joi';
const commonValidators = {
	email: joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
	name: joi.string(),
	message: joi.string(),
	ph_no: joi.number().integer(),
};
export const addContactValidator = async (data) => {
	try {
		const schema = joi.object({
			email: commonValidators.email.required(),
			name: commonValidators.name.required(),
			message: commonValidators.message.required(),
			ph_no: commonValidators.ph_no.required(),
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
