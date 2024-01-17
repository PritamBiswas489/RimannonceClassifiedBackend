import db from '../databases/models/index.js';
import '../config/environment.js';
import { default as api } from '../config/apiConfig.js';
import { createDropValidator } from '../validators/drop.validator.js';

const { Drop, Nft, Op, Notification } = db;

export const createDrop = async (request) => {
	try {
		const { payload, user } = request;
		const rawData = {
			name: payload.name,
			symbol: payload.symbol,
			image: payload.image,
			description: payload.description,
			dropAddress: payload?.dropAddress,
			walletAddress: payload?.walletAddress,
			maxLimit: payload?.maxLimit,
		};
		const [err, validatedData] = await createDropValidator(rawData);
		if (err) {
			return err;
		}
		const formData = {
			image: validatedData?.image,
		};
		const result = await api.post('/api/upload-file', formData);
		if (result.data.status === 200) {
			const data = result.data.data;
			const insertedData = {
				userId: user.id,
				name: validatedData.name,
				symbol: validatedData.symbol,
				image: data.image,
				description: validatedData.description,
				dropAddress: validatedData?.dropAddress,
				walletAddress: validatedData?.walletAddress,
				maxLimit: validatedData?.maxLimit,
			};
			const dropData = await Drop.create(insertedData);

			await Notification.create({
				fromId: user.id,
				toId: 1,
				isRead: 0,
				message: `Added new drop ${validatedData?.name}`	 
			});

			return {
				status: 200,
				data: {},
				message: 'Drop created successfully',
				error: {},
			};
		} else {
			return {
				status: 500,
				data: [],
				error: { message: 'Something went wrong !', reason: result?.data?.error?.message },
			};
		}
	} catch (e) {
		return { status: 500, data: [], error: { message: 'Something went wrong !', reason: e.message } };
	}
};

export const listDrop = async (request) => {
	try {
		const { payload, user } = request;

		const limit = 5;
		const page = payload?.page || 1;
		const offset = (page - 1) * limit;

		const { count, rows } = await Drop.findAndCountAll({
			where: { userId: user.id, walletAddress: payload.walletAddress },
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

export const dropDetails = async (request) => {
	try {
		const { payload, user } = request;

		const dropDetails = await Drop.findOne({ where: { dropAddress: payload?.dropAddress, userId: user.id, walletAddress: payload?.walletAddress } });
		const nftCount = await Nft.count({ where: { dropAddress: payload?.dropAddress } });

		return {
			status: 200,
			data: { dropDetails, nftCount },
			message: 'Records fetched',
			error: {},
		};
	} catch (e) {
		return { status: 500, data: [], error: { message: 'Something went wrong !', reason: e.message } };
	}
};
