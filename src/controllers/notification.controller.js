import db from '../databases/models/index.js';
const { Notification, User } = db;

export const createNotification = async (request) => {
	try {
		await Notification.create({
			fromId: 4,
			toId: 5,
			isRead: 0,
			message:
				"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
		});
		return {
			status: 200,
			data: { t: 1 },
			message: 'Records fetched',
			error: {},
		};
	} catch (e) {
		return { status: 500, data: [], error: { message: 'Something went wrong !', reason: e.message } };
	}
};
export const notificationUnReadListCount = async (request) => {
    try {
		const {
			payload,
            user
		} = request;

		const countData = await Notification.count({
			where: { toId: user.id, isRead:0 },
		});
		 
		return {
			status: 200,
			data: countData,
			message: 'Records fetched',
			error: {},
		};
	} catch (e) {
		return { status: 500, data: [], error: { message: 'Something went wrong !', reason: e.message } };
	}

}
export const notificationList = async (request) => {
   
	try {
		const {
			payload,
            user
		} = request;

        
        const limit = 15;
		const page = payload?.page || 1;
		const offset = (page - 1) * limit;
		const { count, rows } = await Notification.findAndCountAll({
			where: { toId: user.id },
			include: [
				{
					model: User,
					as: 'fromUser',
				},
				{
					model: User,
					as: 'toUser',
				},
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
export const notificationMarkAsRead = async (request) => {
    try {
        const {
			payload,
		} = request;

        await Notification.update({ isRead: 1 }, {
            where: {
                isRead: 0,
            },
          })

        return {
			status: 200,
			data: {},
			message: 'Successfully marked as read',
			error: {},
		};
    }catch (e) {
            return { status: 500, data: [], error: { message: 'Something went wrong !', reason: e.message } };
    }
};
export const notificationDelete =  async (request) => {
    try {
        const {
			payload: { notificationId },
		} = request;

        await Notification.destroy({
            where: {
              id: notificationId,
            },
          })
        return {
			status: 200,
			data: { notificationId },
			message: 'Successfully deleted',
			error: {},
		};
    }catch (e) {
            return { status: 500, data: {}, error: { message: 'Something went wrong !', reason: e.message } };
    }
   
}
