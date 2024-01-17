import db from '../databases/models/index.js';
import '../config/environment.js';
import { default as api } from '../config/apiConfig.js';

import { createOrUpdateTheme1, createOrUpdateTheme2, createOrUpdateTheme3, createOrUpdateTheme4 } from '../services/page.service.js';

const { Page } = db;

export const createPage = async (request) => {
	 
	try {
		const { payload, user } = request;
		if (payload?.theme === 'THEME1') {
			
			return createOrUpdateTheme1(request, 'CREATE');
			
		}
		if (payload?.theme === 'THEME2') {
			return createOrUpdateTheme2(request, 'CREATE');
		}
		if (payload?.theme === 'THEME3') {
			return createOrUpdateTheme3(request, 'CREATE');
		}
		if (payload?.theme === 'THEME4') {
			return createOrUpdateTheme4(request, 'CREATE');
		}
		
	} catch (e) {
		return { status: 500, data: [], error: { message: 'Something went wrong !', reason: e.message } };
	}
};
export const changePageTheme = async (request) => {
	try {
		const { payload, user } = request;
		const {page_id,theme} = payload;
		const data = await Page.update({theme:theme}, { where: { id: page_id } });
		return {
			status: 200,
			data: {success:1},
			message: 'Records fetched',
			error: {},
		};
	}catch (e) {
		return { status: 500, data: [], error: { message: 'Something went wrong !', reason: e.message } };
	}
}

export const listPage = async (request) => {
	try {
		const { payload, user } = request;

		const limit = 5;
		const page = payload?.page || 1;
		const offset = (page - 1) * limit;
		const pageType = payload?.pageType || 'PUBLIC';

		const { count, rows } = await Page.findAndCountAll({
			where: { userId: user.id, type: pageType.toUpperCase() },
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

export const pageDetails = async (request) => {
	try {
		const {
			payload: { id },
		} = request;

		const pageDetails = await Page.findOne({ where: { uuid: id } });

		return {
			status: 200,
			data: pageDetails,
			message: 'Records fetched',
			error: {},
		};
	} catch (e) {
		return { status: 500, data: [], error: { message: 'Something went wrong !', reason: e.message } };
	}
};

export const editPage = async (request) => {
	try {
		const { payload, user } = request;

		if (payload?.theme === 'THEME1') {
			return createOrUpdateTheme1(request, 'UPDATE');
		}
		if (payload?.theme === 'THEME2') {
			return createOrUpdateTheme2(request, 'UPDATE');
		}
		if (payload?.theme === 'THEME3') {
			return createOrUpdateTheme3(request, 'UPDATE');
		}
		if (payload?.theme === 'THEME4') {
			return createOrUpdateTheme4(request, 'UPDATE');
		}
	} catch (e) {
		return { status: 500, data: [], error: { message: 'Something went wrong !', reason: e.message } };
	}
};

export const publishPage = async (request) => {
	try {
		const {
			payload: { id },
		} = request;
		console.log(id);
		const updatedData = {
			isPublished: 1,
			type: 'PUBLIC',
		};
		const data = await Page.update(updatedData, { where: { uuid: id } });
		return {
			status: 200,
			data: {},
			message: 'Page published !',
			error: {},
		};
	} catch (e) {
		return { status: 500, data: [], error: { message: 'Something went wrong !', reason: e.message } };
	}
};
