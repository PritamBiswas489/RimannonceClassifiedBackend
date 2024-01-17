import joi from 'joi';
const commonValidators = {
	name: joi.string(),
	address1: joi.string(),
	address2: joi.string(),
	cardHolder: joi.string(),
	cardNumber: joi.number().integer(),
	city: joi.string(),
	comment: joi.string(),
	country: joi.string(),
	cvv: joi.number().integer(),
	email: joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'io'] } }),
	expiryMonth: joi.number().integer(),
	expiryYear: joi.number().integer(),
	phone: joi.number().integer(),
	postCode: joi.number().integer(),
	privacy: joi.number().integer(),
	state: joi.string(),
	terms: joi.number().integer(),
};

export const checkoutValidator = async (data) => {
	try {
		const schema = joi.object({
			name: commonValidators.name.required(),
			address1: commonValidators.address1.required(),
			address2: commonValidators.address2.required(),
			cardHolder: commonValidators.cardHolder.required(),
			cardNumber: commonValidators.cardNumber.required(),
			city: commonValidators.city.required(),
			comment: commonValidators.comment.required(),
			country: commonValidators.country.required(),
			cvv: commonValidators.cvv.required(),
			email: commonValidators.email.required(),
			expiryMonth: commonValidators.expiryMonth.required(),
			expiryYear: commonValidators.expiryYear.required(),
			phone: commonValidators.phone.required(),
			postCode: commonValidators.postCode.required(),
			privacy: commonValidators.privacy.required(),
			state: commonValidators.state.required(),
			terms: commonValidators.terms.required(),
		});
		const validatedData = await schema.validateAsync(data);

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
