import db from '../databases/models/index.js';
import '../config/environment.js';
import { default as api } from '../config/apiConfig.js';

const { Drop, Nft, PageAccess, Op, Notification } = db;

export const dropListByUserId = async (request) => {
	try {
		const { payload, user } = request;

		const dropList = await Drop.findAll({
			where: { userId: user.id },
		});
		return {
			status: 200,
			data: dropList,
			message: 'Records fetched',
			error: {},
		};
	} catch (e) {
		return { status: 500, data: [], error: { message: 'Something went wrong !', reason: e.message } };
	}
};

export const nftListByDropId = async (request) => {
	try {
		const { payload, user } = request;

		const nftList = await Nft.findAll({
			where: { userId: user.id, dropId: payload.dropId },
		});
		return {
			status: 200,
			data: nftList,
			message: 'Records fetched',
			error: {},
		};
	} catch (e) {
		return { status: 500, data: [], error: { message: 'Something went wrong !', reason: e.message } };
	}
};

export const create = async (request) => {
		const { payload, user } = request;
		const createPromises = [];
		await PageAccess.destroy({
			where: {
				pageId: payload?.[0]?.pageId,
			}
		  })
		  for (const key in payload) {
			createPromises.push(
			  PageAccess.create({
				userId: user.id,
				pageId: payload[key].pageId,
				dropId: payload[key].dropId,
				nftId: payload[key].nftId,
			  })
			);
		  }
		  try {
			await Promise.all(createPromises);
			await Notification.create({
				fromId: user.id,
				toId: 1,
				isRead: 0,
				message: 'Added nfts for his page'	 
			});
			return {
				status: 200,
				data: {},
				message: 'Page access created successfully',
				error: {},
			};
		  } catch (error) {
			return { status: 500, data: [], error: { message: 'Something went wrong !', reason: e.message } };
		  }
		
		
	 
};

export const details = async (request) => {
	try {
		const { payload, user } = request;

		const pageAccessData = await PageAccess.findAll({
			where: { pageId: payload.pageId },
			include: [
				{
					model: Drop,
				},
				{
					model: Nft,
				},
			],
			raw: true,
		});

		return {
			status: 200,
			data: pageAccessData,
			message: 'Records fetched',
			error: {},
		};
	} catch (e) {
		return { status: 500, data: [], error: { message: 'Something went wrong !', reason: e.message } };
	}
};
