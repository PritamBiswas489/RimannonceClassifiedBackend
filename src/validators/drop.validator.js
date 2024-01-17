import joi from 'joi';
import db from '../databases/models/index.js';
const { User, Drop, Op } = db;

const commonValidators = {
	name: joi.string(),
	symbol: joi.string(),
	image: joi.string(),
	description: joi.string(),
	dropAddress: joi.string(),
	walletAddress: joi.string(),
	maxLimit: joi.number().integer(),
};

export const createDropValidator = async (data) => {
	try {
		const schema = joi.object({
			name: commonValidators.name.required(),
			symbol: commonValidators.symbol.required(),
			image: commonValidators.image.required(),
			description: commonValidators.description.required(),
			dropAddress: commonValidators.dropAddress,
			walletAddress: commonValidators.walletAddress,
			maxLimit: commonValidators.maxLimit.required(),
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
