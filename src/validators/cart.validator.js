import joi from 'joi';
const commonValidators = {
	productId: joi.number().integer(),
	quantity: joi.number().integer(),
};

export const addToCartValidator = async (data) => {
	try {
		const schema = joi.object({
			productId: commonValidators.productId.required(),
			quantity: commonValidators.quantity.required(),
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
