import db from '../databases/models/index.js';
import { default as api } from '../config/apiConfig.js';
import { slugify } from '../libraries/utility.js';
const { Drop, Nft,  TicketConversation, User } = db;

export const createContent = async (request) => {
    
	try {
		const { payload, user } = request;
		const insertedData = {
			message: payload.message,
            ticketId: payload.ticketId,
            fromUserId:user.id
		};
        const result = await TicketConversation.create(insertedData);
		return {
            status: 200,
            data: {},
            message: 'Message send successfully',
            error: {},
        };
	} catch (e) {
		return { status: 500, data: [], error: { message: 'Something went wrong !', reason: e.message } };
	}
};
export const details = async (request) => {
	try {
		const { payload, user } = request;
		const blogDetails = await TicketConversation.findOne({ where: { id: payload.id } });
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
		const t_id = payload?.t_id;
        const whereCondition = { ticketId: t_id };
		const { count, rows } = await TicketConversation.findAndCountAll({
            where: whereCondition,
			order: [['id', 'ASC']],
            include: [
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
			message: 'Records fetched',
			error: {},
		};
	} catch (e) {
		return { status: 500, data: [], error: { message: 'Something went wrong !', reason: e.message } };
	}

}
export const listTicketConversationAll =  async (request) => {
    try {
		const { payload, user } = request;
		const limit = 15;
		const page = payload?.page || 1;
		const offset = (page - 1) * limit;

		const { count, rows } = await TicketConversation.findAndCountAll({
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
        const blogData = await TicketConversation.update(insertedData, { where: { id: payload.id } });
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
		const blogDetails = await TicketConversation.destroy({ where: { id: payload.id } });
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
 