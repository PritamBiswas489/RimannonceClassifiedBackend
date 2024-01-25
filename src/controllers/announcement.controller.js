import db from '../databases/models/index.js';
import { default as api } from '../config/apiConfig.js';
const { Announcement, Op } = db;

export const createAnnouncement = async (request) => {
    try {
		const { payload, user } = request;
		const announcementData = {
			title: payload?.title,
			category: payload?.category,
			description: payload?.description,
			locationId: payload?.locationId,
			location: payload?.location,
			subLocationId: payload?.subLocationId,
			subLocation: payload?.subLocation,
			gpDeliveryOrigin: payload?.gpDeliveryOrigin,
			gpDeliveryDestination: payload?.gpDeliveryDestination,
			gpDeliveryDate: payload?.gpDeliveryDate,
			contactNumber: payload?.contactNumber,
			isPremium: payload?.isPremium || 0,
			createdBy:user?.id || 0 ,
		};
	    const createData = await Announcement.create(announcementData);
        return {
            status: 200,
            data: {user_id:user?.id},
            message: 'Announcement created successfully',
            error: {},
        };
	} catch (e) {
		return { status: 500, data: [], error: { message: 'Something went wrong !', reason: e.message } };
	}
   
}
export const listAnnouncement = async (request) =>{
    try {
		const { payload } = request;
		const limit = 15;
		const page = payload?.page || 1;
		const offset = (page - 1) * limit;

		const { count, rows } = await Announcement.findAndCountAll({
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