import db from '../databases/models/index.js';
import { default as api } from '../config/apiConfig.js';
const { Announcement, AnnouncementMedia, Op } = db;

export const createAnnouncement = async (request) => {
	try {
		const { payload, user, files } = request;
		if (files.length === 0) {
			return { status: 500, data: [], error: { message: 'Upload some media for this announcement!' } };
		}
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
			createdBy: user?.id || 0,
		};
		const createData = await Announcement.create(announcementData);
		if (createData?.id) {
			const promises = files.map(async (data, index) => {
				const mediaData = {
					announcementId: createData?.id,
					filePath: data.path,
					fileType: data.fileType,
				};
				return await AnnouncementMedia.create(mediaData);
			});
			const resolvedData = await Promise.all(promises);
			return {
				status: 200,
				data: createData,
				message: 'Announcement created successfully',
				error: {},
			};
		} else {
			return { status: 500, data: [], error: { message: 'Failed !' } };
		}
	} catch (e) {
		return { status: 500, data: [], error: { message: 'Something went wrong !', reason: e.message } };
	}
};
export const listAnnouncement = async (request) => {
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
};
