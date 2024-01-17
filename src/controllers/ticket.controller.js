import db from '../databases/models/index.js';
import { default as api } from '../config/apiConfig.js';
import { slugify } from '../libraries/utility.js';
const { Drop, Nft,  Ticket, TicketType,User } = db;

export const createContent = async (request) => {
    
	try {
		const { payload, user } = request;
		const insertedData = {
			question: payload.question,
            ticketType: payload.ticketType,
            userId:user.id
		};
        const result = await Ticket.create(insertedData);
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
		const blogDetails = await Ticket.findOne({ where: { id: payload.id } });
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

        let whereCondition = {};

        if(user.id!==1){
            whereCondition = { userId: user.id };
        }

		const { count, rows } = await Ticket.findAndCountAll({
            where: whereCondition,
			offset: offset,
			limit: limit,
			order: [['id', 'DESC']],
            include: [
				{
					model: TicketType,
					as: 'ticketTypeDetail',
				},
				{
					model: User,
					as: 'userDetail',
				},
			],
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
            page,
            limit,
			message: 'Records fetched',
			error: {},
		};
	} catch (e) {
		return { status: 500, data: [], error: { message: 'Something went wrong !', reason: e.message } };
	}

}
export const listTicketAll =  async (request) => {
    try {
		const { payload, user } = request;
		const limit = 15;
		const page = payload?.page || 1;
		const offset = (page - 1) * limit;

		const { count, rows } = await Ticket.findAndCountAll({
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
			question: payload.question,
            ticketType: payload.ticketType,
		};
        const blogData = await Ticket.update(insertedData, { where: { id: payload.id } });
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
		const blogDetails = await Ticket.destroy({ where: { id: payload.id } });
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
export const close = async (request) => {
    try {
		const { payload, user } = request;
		const insertedData = {
			status: 1,
		};
        const blogData = await Ticket.update(insertedData, { where: { id: payload.id } });
		return {
			status: 200,
			data: payload,
			message: 'Ticket closed successfully !',
			error: {},
		};
	} catch (e) {
		return { status: 500, data: [], error: { message: 'Something went wrong !', reason: e.message } };
	}

}