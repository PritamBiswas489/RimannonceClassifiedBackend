import joi from 'joi';
import db from '../databases/models/index.js';
const { User, Drop, Op } = db;

const commonValidators = {
	dropId: joi.number().integer(),
	dropAddress: joi.string(),
	walletAddress: joi.string(),
	metaData: joi.any(),
	totalQuantity: joi.number().integer(),
	availQuantity: joi.number().integer(),
	tokenId: joi.number().integer(),
	directListId: joi.number().integer(),
	pricePerToken: joi.number(),
};

export const mintNftValidator = async (data) => {
	try {
		const schema = joi.object({
			dropId: commonValidators.dropId.required(),
			dropAddress: commonValidators.dropAddress.required(),
			walletAddress: commonValidators.walletAddress.required(),
			metaData: commonValidators.metaData.required(),
			totalQuantity: commonValidators.totalQuantity.required(),
			availQuantity: commonValidators.availQuantity.required(),
			tokenId: commonValidators.tokenId.required(),
			directListId: commonValidators.directListId.required(),
			pricePerToken: commonValidators.pricePerToken.required(),
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
