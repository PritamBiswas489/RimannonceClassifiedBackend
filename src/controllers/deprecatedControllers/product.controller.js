import db from '../databases/models/index.js';
import '../config/environment.js';

import { default as api } from '../config/apiConfig.js';
import { createProductValidator, updateProductValidator } from '../validators/product.validator.js';

const { Drop, Nft, Product, Op, Notification } = db;

export const create = async (request) => {
	try {
		const { payload, user } = request;

		const rawData = {
			image: payload?.image,
			name: payload?.name,
			description: payload?.description,
			metaData: payload?.metaData,
			price: payload?.price,
			stock: payload?.stock,
		};
		const [err, validatedData] = await createProductValidator(rawData);
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
				image: data?.image,
				name: validatedData?.name,
				description: validatedData?.description,
				metaData: validatedData?.metaData,
				price: validatedData?.price,
				stock: validatedData?.stock,
				status: 1,
			};

			const productData = await Product.create(insertedData);

			await Notification.create({
				fromId: user.id,
				toId: 1,
				isRead: 0,
				message: `Added new product ${validatedData?.name}`	 
			});
			
			return {
				status: 200,
				data: { productId: productData.uuid },
				message: 'Product created successfully',
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

export const edit = async (request) => {
	try {
		const { payload, user } = request;

		const rawData = {
			image: payload?.image,
			name: payload?.name,
			description: payload?.description,
			metaData: payload?.metaData,
			price: payload?.price,
			stock: payload?.stock,
		};
		const [err, validatedData] = await updateProductValidator(rawData);
		if (err) {
			return err;
		}
		const formData = {
			image: validatedData?.image,
		};
		const result = await api.post('/api/upload-file', formData);
		if (result.data.status === 200) {
			const data = result.data.data;

			const updatedData = {
				image: data?.image,
				name: validatedData?.name,
				description: validatedData?.description,
				metaData: validatedData?.metaData,
				price: validatedData?.price,
				stock: validatedData?.stock,
			};

			const productData = await Product.update(updatedData, { where: { uuid: payload?.id } });

			return {
				status: 200,
				data: {},
				message: 'Product updated successfully',
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

export const list = async (request) => {
	try {
		const { payload, user } = request;

		const limit = 15;
		const page = payload?.page || 1;
		const offset = (page - 1) * limit;

		const { count, rows } = await Product.findAndCountAll({
			where: { userId: user.id },
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

export const details = async (request) => {
	try {
		const { payload, user } = request;

		const productDetails = await Product.findOne({ where: { uuid: payload.id } });

		return {
			status: 200,
			data: productDetails,
			message: 'Records fetched',
			error: {},
		};
	} catch (e) {
		return { status: 500, data: [], error: { message: 'Something went wrong !', reason: e.message } };
	}
};

export const changeStatus = async (request) => {
	try {
		const { payload, user } = request;
		console.log('payload :>> ', payload);

		const productData = await Product.update({ status: payload.status }, { where: { uuid: payload?.id } });

		return {
			status: 200,
			data: {},
			message: 'Product updated successfully',
			error: {},
		};
	} catch (e) {
		return { status: 500, data: [], error: { message: 'Something went wrong !', reason: e.message } };
	}
};
