import db from '../databases/models/index.js';
import { default as api } from '../config/apiConfig.js';
const { Subscription, Op  } = db;

export const createSubscription = async (request) => {
	try {
		const { payload, user } = request;
        const getData = await Subscription.findOne({ where: { email: payload.email } });
        if(getData){
            return { status: 500, data: [], error: { message: 'Email already registered!' } };
        }
		const blogData = await Subscription.create({ email: payload.email });
			return {
				status: 200,
				data: {},
				message: 'Subscription created successfully',
				error: {},
			};
	} catch (e) {
		return { status: 500, data: [], error: { message: 'Something went wrong !', reason: e.message } };
	}
};
export const listSubscriptions = async (request) => {
	try {
		const { payload, user } = request;
		const limit = 15;
		const page = payload?.page || 1;
		const offset = (page - 1) * limit;

		const { count, rows } = await Subscription.findAndCountAll({
			offset: offset,
			limit: limit,
			order: [['id', 'DESC']],
		});
		const data = {
			meta: {
				totalRecords: count,
			},
			records: rows,
		};
		return {
			status: 200,
			data: data,
			message: 'Records fetched',
			error: {},
		};
	} catch (e) {
		return { status: 500, data: [], error: { message: 'Something went wrong !', reason: e.message } };
	}
};

 
