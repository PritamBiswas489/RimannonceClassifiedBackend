import joi from 'joi';
import db from '../databases/models/index.js';
const { User, Op } = db;

const commonValidators = {
	image: joi.string(),
	name: joi.string(),
	description: joi.string(),
	metaData: joi.any(),
	price: joi.number(),
	stock: joi.number().integer(),
	status: joi.number().integer(),
};

export const createProductValidator = async (data) => {
	try {
		const schema = joi.object({
			image: commonValidators.image.required(),
			name: commonValidators.name.required(),
			description: commonValidators.description.required(),
			metaData: commonValidators.metaData.optional(),
			price: commonValidators.price.required(),
			stock: commonValidators.stock.required(),
			// status: commonValidators.status.required(),
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

export const updateProductValidator = async (data) => {
	try {
		const schema = joi.object({
			image: commonValidators.image.required(),
			name: commonValidators.name.required(),
			description: commonValidators.description.required(),
			metaData: commonValidators.metaData.optional(),
			price: commonValidators.price.required(),
			stock: commonValidators.stock.required(),
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
