import db from '../databases/models/index.js';
import { default as api } from '../config/apiConfig.js';
import { slugify } from '../libraries/utility.js';
const { Drop, Nft,  ArtistType } = db;

export const createContent = async (request) => {
    
	try {
		const { payload, user } = request;
		const insertedData = {
			name: payload.name,
		};
        const result = await ArtistType.create(insertedData);
		return {
            status: 200,
            data: {},
            message: 'Content created successfully',
            error: {},
        };
	} catch (e) {
		return { status: 500, data: [], error: { message: 'Something went wrong !', reason: e.message } };
	}
};
export const details = async (request) => {
	try {
		const { payload, user } = request;
		const blogDetails = await ArtistType.findOne({ where: { id: payload.id } });
		return {
			status: 200,
			data: blogDetails,
			message: 'Records fetched',
			error: {},
		};
	} catch (e) {
		return { status: 500, data: [], error: { message: 'Something went wrong !', reason: e.message } };
	}
};
export const listContent = async (request) => {
    try {
		const { payload, user } = request;
		const limit = 15;
		const page = payload?.page || 1;
		const offset = (page - 1) * limit;

		const { count, rows } = await ArtistType.findAndCountAll({
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

}
export const listArtistAll =  async (request) => {
    try {
		const { payload, user } = request;
		const limit = 15;
		const page = payload?.page || 1;
		const offset = (page - 1) * limit;

		const { count, rows } = await ArtistType.findAndCountAll({
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

}
export const editContent = async (request) => {
    try {
		const { payload, user } = request;
		const insertedData = {
			name: payload.name,
		};
        const blogData = await ArtistType.update(insertedData, { where: { id: payload.id } });
		return {
            status: 200,
            data: {},
            message: 'Content updated successfully',
            error: {},
        };
	} catch (e) {
		return { status: 500, data: [], error: { message: 'Something went wrong !', reason: e.message } };
	}
}
export const destroy = async (request) => {
    try {
		const { payload, user } = request;
		const blogDetails = await ArtistType.destroy({ where: { id: payload.id } });
		return {
			status: 200,
			data: blogDetails,
			message: 'Record deleted successfully !',
			error: {},
		};
	} catch (e) {
		return { status: 500, data: [], error: { message: 'Something went wrong !', reason: e.message } };
	}

}