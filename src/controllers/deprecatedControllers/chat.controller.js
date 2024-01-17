import pusher from '../config/pusher.config.js';
import db from '../databases/models/index.js';
import '../config/environment.js';
import { generatePusherChannel } from '../libraries/utility.js';

const {
	Drop,
	Nft,
	Product,
	Cart,
	PrivateChat,
	GroupChat,
	User,
	ChatRequest,
	Op,
	sequelize,
	Notification,
	Sequelize: { QueryTypes },
} = db;

export const pusherAuth = async (request) => {
	try {
		const { payload, user } = request;
		const { socket_id: socketId, channel_name: channel } = payload;

		const presenceData = {
			user_id: user.id,
			user_info: user,
		};
		const authResponse = pusher.authorizeChannel(socketId, channel, presenceData);

		return authResponse;
	} catch (e) {
		return { status: 500, data: [], error: { message: 'Something went wrong !', reason: e.message } };
	}
};

export const sendMessage = async (request) => {
	try {
		const { payload, user } = request;

		const insertedData = {
			sender: user.id,
			receiver: payload.receiver,
			message: payload.message,
			isRead: payload.isRead,
		};

		const privateChatData = await PrivateChat.create(insertedData);

		const channelName = generatePusherChannel(user.id, payload.receiver);
		pusher.trigger(channelName, 'send-message', { sender: user.id, receiver: payload.receiver });

		const channel2Name = `presence-private-global-channel`;

		pusher.trigger(channel2Name, 'update-user-list', [payload.receiver, user.id]);
		return {
			status: 200,
			data: {},
			message: 'successfully',
			error: {},
		};
	} catch (e) {
		return { status: 500, data: [], error: { message: 'Something went wrong !', reason: e.message } };
	}
};

export const userList = async (request) => {
	try {
		const { payload, user } = request;
		let userIds = [];
		if(user.id!==1){
			const [results, metadata] = await sequelize.query(`CALL get_chat_user_list(:userId)`, {
				replacements: { userId: user.id },
				type: QueryTypes.SELECT,
				
			});
			
			Object.values(results).forEach((result) =>  userIds.push(result.userId));
			userIds.push(1);
		}else{
				const sqlCondition = `(SELECT COUNT(*) FROM pages WHERE pages.user_id = User.id) > 0`;
				const whereConditions = {
					[Op.and]: [
					sequelize.literal(sqlCondition),
					{ role: { [Op.not]: 'ADMIN' } }  
					]
				};
				
				const rows = await User.findAll({
					where: whereConditions,
					order: [['isPromoted', 'DESC']],
					raw: true  
				});
				if(rows.length > 0){
					rows.forEach((value,index)=>{
						userIds.push(value.id);
					})
				}


		}
		
		if (userIds.length < 1) {
			return {
				status: 200,
				data: [],
				user_id: user.id,
				message: 'successfully',
				error: {},
			};
		}
		// const userIds = [];
		const [userLists] = await sequelize.query(
			`SELECT
				u.id AS userId,
				u.name AS userName,
				u.avatar AS userImg,
				(
					SELECT p.message
					FROM private_chat p
					WHERE 
						(p.sender = :mainUserId AND p.receiver = u.id)
						OR (p.sender = u.id AND p.receiver = :mainUserId)
					ORDER BY p.created_at DESC
					LIMIT 1
				) AS lastMessage,
				(
					SELECT p.created_at
					FROM private_chat p
					WHERE 
						(p.sender = :mainUserId AND p.receiver = u.id)
						OR (p.sender = u.id AND p.receiver = :mainUserId)
					ORDER BY p.created_at DESC
					LIMIT 1
				) AS lastMessageCreatedAt,
				(
					SELECT COUNT(*)
					FROM private_chat p
					WHERE 
						(p.sender = u.id AND p.receiver = :mainUserId)
						AND p.is_read = 0
				) AS unreadMssageCount
			FROM users u
			WHERE u.id IN (:userIds) ORDER BY lastMessageCreatedAt desc;`,
			{
				replacements: { userIds: userIds, mainUserId: user.id },
				// replacements: { userIds: '2' },
				// type: QueryTypes.SELECT,
				plain: false,
			}
		);
		console.log('userLists :>> ', userLists);

		// const userLists = await User.findAll({ where: { id: userIds } });
		// for(let i = 0; i < userLists.length; i++) {

		// }
		return {
			status: 200,
			data: userLists,
			userIds,
			user_id: user.id,
			message: 'successfully',
			error: {},
		};
	} catch (e) {
		return { status: 500, data: [], error: { message: 'Something went wrong !', reason: e.message } };
	}
};

export const chatList = async (request) => {
	try {
		const { payload, user } = request;
		// const channelName = 'presence-channel-1-2';
		// const channelName = generatePusherChannel(user.id, payload.userId);
		// pusher.trigger(channelName, 'send-message', { name: 'biplab das' });
		const user1 = user.id;
		const user2 = payload.userId;

		// receiver unread status chage
		await PrivateChat.update(
			{ isRead: 1 },
			{
				where: {
					sender: user2,
					receiver: user1,
				},
			}
		);
		const chatList = await PrivateChat.findAll({
			where: {
				[Op.or]: [
					{
						[Op.and]: [{ sender: user1 }, { receiver: user2 }],
					},
					{
						[Op.and]: [{ sender: user2 }, { receiver: user1 }],
					},
				],
			},
			include: [
				{
					model: User,
					as: 'senderDetails',
				},
				{
					model: User,
					as: 'receiverDetails',
				},
			],
		});

		// triger event for update side panel
		const channelName = `presence-private-global-channel`;

		pusher.trigger(channelName, 'update-user-list', [user1]);

		return {
			status: 200,
			data: chatList,
			message: 'successfully',
			error: {},
		};
	} catch (e) {
		return { status: 500, data: [], error: { message: 'Something went wrong !', reason: e.message } };
	}
};

export const userTyping = async (request) => {
	try {
		const { payload, user } = request;

		const channelName = generatePusherChannel(user.id, payload.userId);
		pusher.trigger(channelName, 'user-typing', { sender: user.id, senderName: user.name, receiver: payload.userId });

		return {
			status: 200,
			data: {},
			message: 'successfully',
			error: {},
		};
	} catch (e) {
		return { status: 500, data: [], error: { message: 'Something went wrong !', reason: e.message } };
	}
};

export const getChatRequest = async (request) => {
	try {
		const { payload, user } = request;
		const user1 = user.id;
		const user2 = payload.userId;
		let chatRequestData = await ChatRequest.findOne({
			where: {
				[Op.or]: [
					{
						[Op.and]: [{ senderId: user1 }, { recieverId: user2 }],
					},
					{
						[Op.and]: [{ senderId: user2 }, { recieverId: user1 }],
					},
				],
			},
		});
		if(parseInt(user1)=== 1 || parseInt(user2) === 1){
			chatRequestData = {
				id: 9999999,
				senderId: user1,
				recieverId: user2,
				status: "ACCEPTED",
				 
			};
		}
		return {
			status: 200,
			data: chatRequestData,
			message: 'successfully',
			user1,
			user2,
			error: {},
		};
	} catch (e) {
		return { status: 500, data: [], error: { message: 'Something went wrong !', reason: e.message } };
	}
};

export const sendChatRequest = async (request) => {
	try {
		const { payload, user } = request;
		const sender = user.id;
		const receiver = payload.userId;
		const insertedData = {
			senderId: sender,
			recieverId: receiver,
			status: 'PENDING',
		};

		const chatRequestData = await ChatRequest.create(insertedData);

		//===== Send Notification ====//

		await Notification.create({
			fromId: sender,
			toId: receiver,
			isRead: 0,
			message: `You got a new chat request.`	 
		});



		const channelName = generatePusherChannel(sender, receiver);
		pusher.trigger(channelName, 'send-chat-request', { sender: user.id, senderName: user.name, receiver: receiver });

		return {
			status: 200,
			data: chatRequestData,
			message: 'successfully',
			error: {},
		};
	} catch (e) {
		return { status: 500, data: [], error: { message: 'Something went wrong !', reason: e.message } };
	}
};

export const changeChatRequestStatus = async (request) => {
	try {
		const { payload, user } = request;
		const sender = user.id;
		const receiver = payload.userId;
		const updatedData = {
			status: payload.status,
		};

		await Notification.create({
			fromId: sender,
			toId: receiver,
			isRead: 0,
			message: `Your chat request ${payload.status}.`	 
		});

		const chatRequestData = await ChatRequest.update(updatedData, { where: { id: payload.id } });
		const channelName = generatePusherChannel(sender, receiver);
		pusher.trigger(channelName, 'change-chat-request-status', { sender: user.id, senderName: user.name, receiver: receiver });

		return {
			status: 200,
			data: chatRequestData,
			message: 'successfully',
			error: {},
		};
	} catch (e) {
		return { status: 500, data: [], error: { message: 'Something went wrong !', reason: e.message } };
	}
};

/**
 *
 * --------------------------- group chat ----------------------------------
 */

export const groupChatSendMessage = async (request) => {
	try {
		const { payload, user } = request;

		const insertedData = {
			sender: user.id,
			message: payload.message,
			pageUuid: payload.pageUuid,
		};

		const groupChatData = await GroupChat.create(insertedData);

		const channelName = `presence-group-chat-channel-${payload.pageUuid}`;
		pusher.trigger(channelName, 'send-message', { sender: user.id });

		return {
			status: 200,
			data: {},
			message: 'Message successfully sent',
			error: {},
		};
	} catch (e) {
		return { status: 500, data: [], error: { message: 'Something went wrong !', reason: e.message } };
	}
};

export const groupChatList = async (request) => {
	try {
		const { payload, user } = request;

		const limit = 50;
		const page = payload?.page || 1;
		const offset = (page - 1) * limit;

		const { count, rows } = await GroupChat.findAndCountAll({
			where: {
				pageUuid: payload.pageUuid,
			},
			offset: offset,
			limit: limit,
			order: [['id', 'DESC']],
			include: [
				{
					model: User,
					as: 'senderDetails',
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
};

export const groupChatUserTyping = async (request) => {
	try {
		const { payload, user } = request;
		const channelName = `presence-group-chat-channel-${payload.pageUuid}`;
		pusher.trigger(channelName, 'user-typing', { sender: user.id, senderName: user.name });

		return {
			status: 200,
			data: {},
			message: 'successfully',
			error: {},
		};
	} catch (e) {
		return { status: 500, data: [], error: { message: 'Something went wrong !', reason: e.message } };
	}
};
