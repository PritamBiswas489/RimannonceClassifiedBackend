import joi from 'joi';
import db from '../databases/models/index.js';
const { User, Drop, Op } = db;

const commonValidators = {
	title: joi.string(),
	attachment: joi.string(),
	attachmentType: joi.string(),
	description: joi.string(),
};

export const createBlogValidator = async (data) => {
	try {
		const schema = joi.object({
			title: commonValidators.title.required(),
			attachment: commonValidators.attachment.required(),
			attachmentType: commonValidators.attachmentType.required(),
			description: commonValidators.description.required(),
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

export const editBlogValidator = async (data) => {
	try {
		const schema = joi.object({
			title: commonValidators.title.required(),
			attachment: commonValidators.attachment.required(),
			attachmentType: commonValidators.attachmentType.required(),
			description: commonValidators.description.required(),
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
