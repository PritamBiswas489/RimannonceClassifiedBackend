import db from '../databases/models/index.js';
import '../config/environment.js';
import { hashStr } from '../libraries/auth.js';

const { User, Drop, Nft, Product, Cart, Order, OrderShipping, OrderProduct, Op, Sequelize, Locations, SubLocations, Announcement, ContactUs, Categories  } = db;

export const updateUserEmail = async (request) => {
	try {
		const { payload } = request;
		const { email, user_id } = payload;
		const userDetails = await User.findOne({
			where: {
				email: email,
				id: {
					[Sequelize.Op.not]: user_id,
				},
			},
		});
		if (userDetails) {
			throw new Error('Email already used for other user.');
		}
		await User.update(
			{ email: email },
			{
				where: {
					id: user_id,
				},
			}
		);
		return {
			status: 200,
			data: { success: 1 },
			message: 'Record fetched',
			error: {},
		};
	} catch (e) {
		return { status: 500, data: [], error: { message: e?.message || 'Something went wrong !', reason: e.message } };
	}
};
export const updateUserPassword = async (request) => {
	try {
		const { payload } = request;
		const { password, user_id } = payload;
		await User.update(
			{
				password: await hashStr(password),
			},
			{
				where: {
					id: user_id,
				},
			}
		);
		return {
			status: 200,
			data: { success: 1 },
			message: 'Record fetched',
			error: {},
		};
	} catch (e) {
		return { status: 500, data: [], error: { message: 'Something went wrong !', reason: e.message } };
	}
};

export const setPromote = async (request) => {
	try {
		const { payload } = request;
		const user_id = payload?.user_id || 0;
		const userDetails = await User.findOne({ where: { id: user_id } });

		if (userDetails.isPromoted === 1) {
			await User.update(
				{ isPromoted: 0 },
				{
					where: {
						id: user_id,
					},
				}
			);
		} else {
			await User.update(
				{ isPromoted: 1 },
				{
					where: {
						id: user_id,
					},
				}
			);
		}

		return {
			status: 200,
			data: { user_id },
			message: 'Record fetched',
			error: {},
		};
	} catch (e) {
		return { status: 500, data: [], error: { message: 'Something went wrong !', reason: e.message } };
	}
};
export const announcmentList = async (request) => {
	try {
		const { payload } = request;
		const limit = 15;
		const page = payload?.page || 1;
		const cat = payload?.cat || '';
		const locationids = payload?.locationids ? JSON.parse(payload?.locationids) : [];
		const search = payload?.s;
		const offset = (page - 1) * limit;
	

		const whereData = { };
		if (cat !== '') {
			whereData.category = cat;
		}
		if (search !== '') {
			// Use sequelize's [Op.or] for a search on title or location
			whereData[Op.or] = [
				{ title: { [Op.like]: `%${search}%` } },
				{ location: { [Op.like]: `%${search}%` } },
				{ subLocation: { [Op.like]: `%${search}%` } },
				{ gpDeliveryOrigin: { [Op.like]: `%${search}%` } },
				{ gpDeliveryDestination: { [Op.like]: `%${search}%` } },
			];
		}
		if (locationids && locationids.length > 0) {
			// Include condition for locationids
			whereData.locationId = { [Op.in]: locationids };
		}
		const { count, rows } = await Announcement.findAndCountAll({
			where: whereData,
			attributes: {
				include: [
					[
						Sequelize.literal(
							'(SELECT file_path FROM announcement_medias WHERE file_type = "images" AND announcement_medias.announcement_id = Announcement.id LIMIT 1)'
						),
						'media',
					],
				],
			},
			include: [
				{
					model: Locations,
					as: 'announcementLocation',
				},
				{
					model: SubLocations,
					as: 'announcementSubLocation',
				},
				{
					model:User,
					as:'announcementUser'
				}
			],

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
export const categories =  async (request) => {
	try {
		const { payload } = request;

		const limit = 15;
		const page = payload?.page || 1;
		const search = payload?.s || '';
		const offset = (page - 1) * limit;

		let whereData = {  };

		if (search !== '') {
			whereData[Op.or] = [{ name: { [Op.like]: `%${search}%` } }];
		}

		const { count, rows } = await Categories.findAndCountAll({ 
			where: whereData, 
			offset: offset, limit: limit, order: [['id', 'DESC']] });

		const data = {
			meta: {
				totalRecords: count,
				totalPages: Math.ceil(count / limit),
			},
			records: rows,
		};
		return {
			status: 200,
			data: data,
			message: 'Record fetched',
			error: {},
		};
	} catch (e) {
		return { status: 500, data: [], error: { message: 'Something went wrong !', reason: e.message } };
	}

}
export const locations =  async (request) => {
	try {
		const { payload } = request;

		const limit = 15;
		const page = payload?.page || 1;
		const search = payload?.s || '';
		const offset = (page - 1) * limit;

		let whereData = {  };

		if (search !== '') {
			whereData[Op.or] = [{ name: { [Op.like]: `%${search}%` } }];
		}

		const { count, rows } = await Locations.findAndCountAll({ 
			where: whereData, 
			offset: offset, limit: limit, order: [['id', 'DESC']] });

		const data = {
			meta: {
				totalRecords: count,
				totalPages: Math.ceil(count / limit),
			},
			records: rows,
		};
		return {
			status: 200,
			data: data,
			message: 'Record fetched',
			error: {},
		};
	} catch (e) {
		return { status: 500, data: [], error: { message: 'Something went wrong !', reason: e.message } };
	}

}
export const subLocations =  async (request) => {
	try {
		const { payload } = request;

		const limit = 15;
		const page = payload?.page || 1;
		const search = payload?.s || '';
		const offset = (page - 1) * limit;

		let whereData = {  };

		if (search !== '') {
			whereData[Op.or] = [{ name: { [Op.like]: `%${search}%` } }];
		}

		const { count, rows } = await SubLocations.findAndCountAll({ 
			where: whereData, 
			include: [
				{
					model: Locations,
					as: 'locationSublocation',
				},
				 
			],
			offset: offset, limit: limit, order: [['id', 'DESC']] });

		const data = {
			meta: {
				totalRecords: count,
				totalPages: Math.ceil(count / limit),
			},
			records: rows,
		};
		return {
			status: 200,
			data: data,
			message: 'Record fetched',
			error: {},
		};
	} catch (e) {
		return { status: 500, data: [], error: { message: 'Something went wrong !', reason: e.message } };
	}

}


export const contactUstList =  async (request) => {
	 
	try {
		const { payload } = request;

		const limit = 15;
		const page = payload?.page || 1;
		const search = payload?.s || '';
		const offset = (page - 1) * limit;

		let whereData = {  };

		if (search !== '') {
			// Use sequelize's [Op.or] for a search on title or location
			whereData[Op.or] = [{ subject: { [Op.like]: `%${search}%` } }];
		}

		const { count, rows } = await ContactUs.findAndCountAll({ 
			where: whereData, 
			include: [
				{
					model: User,
					as: 'contactUsUser',
				},
				 
			],
			offset: offset, limit: limit, order: [['id', 'DESC']] });

		const data = {
			meta: {
				totalRecords: count,
				totalPages: Math.ceil(count / limit),
			},
			records: rows,
		};
		return {
			status: 200,
			data: data,
			message: 'Record fetched',
			error: {},
		};
	} catch (e) {
		return { status: 500, data: [], error: { message: 'Something went wrong !', reason: e.message } };
	}

}
export const userList = async (request) => {
	try {
		const { payload } = request;

		const limit = 100;
		const page = payload?.page || 1;
		const search = payload?.s || '';
		const offset = (page - 1) * limit;

		let whereData = { role: { [Op.ne]: 'ADMIN' } };

		if (search !== '') {
			// Use sequelize's [Op.or] for a search on title or location
			whereData[Op.or] = [{ name: { [Op.like]: `%${search}%` } }, { email: { [Op.like]: `%${search}%` } }, { phone: { [Op.like]: `%${search}%` } }];
		}

		const { count, rows } = await User.findAndCountAll({ where: whereData, offset: offset, limit: limit, order: [['id', 'DESC']] });

		const data = {
			meta: {
				totalRecords: count,
				totalPages: Math.ceil(count / limit),
			},
			records: rows,
		};
		return {
			status: 200,
			data: data,
			message: 'Record fetched',
			error: {},
		};
	} catch (e) {
		return { status: 500, data: [], error: { message: 'Something went wrong !', reason: e.message } };
	}
};

export const nftList = async (request) => {
	try {
		const { payload } = request;

		const limit = 15;
		const page = payload?.page || 1;
		const offset = (page - 1) * limit;

		const { count, rows } = await Nft.findAndCountAll({ offset: offset, limit: limit, order: [['id', 'DESC']] });

		const data = {
			meta: {
				totalRecords: count,
				totalPages: Math.ceil(count / limit),
			},
			records: rows,
		};
		return {
			status: 200,
			data: data,
			message: 'Record fetched',
			error: {},
		};
	} catch (e) {
		return { status: 500, data: [], error: { message: 'Something went wrong !', reason: e.message } };
	}
};

export const productList = async (request) => {
	try {
		const { payload } = request;

		const limit = 15;
		const page = payload?.page || 1;
		const offset = (page - 1) * limit;

		const { count, rows } = await Product.findAndCountAll({ include: [{ model: User }], offset: offset, limit: limit, order: [['id', 'DESC']] });

		const data = {
			meta: {
				totalRecords: count,
				totalPages: Math.ceil(count / limit),
			},
			records: rows,
		};
		return {
			status: 200,
			data: data,
			message: 'Record fetched',
			error: {},
		};
	} catch (e) {
		return { status: 500, data: [], error: { message: 'Something went wrong !', reason: e.message } };
	}
};

export const orderList = async (request) => {
	try {
		const { payload } = request;

		const limit = 15;
		const page = payload?.page || 1;
		const offset = (page - 1) * limit;

		const { count, rows } = await Order.findAndCountAll({
			include: [
				{
					model: OrderShipping,
				},
				{
					model: OrderProduct,
					include: [
						{
							model: Product,
						},
					],
				},
			],
			offset: offset,
			limit: limit,
			order: [['id', 'DESC']],
		});

		const data = {
			meta: {
				totalRecords: count,
				totalPages: Math.ceil(count / limit),
			},
			records: rows,
		};
		return {
			status: 200,
			data: data,
			message: 'Record fetched',
			error: {},
		};
	} catch (e) {
		return { status: 500, data: [], error: { message: 'Something went wrong !', reason: e.message } };
	}
};
