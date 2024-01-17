import db from '../databases/models/index.js';
import '../config/environment.js';
import { mintNftValidator } from '../validators/nft.validator.js';
import { default as api } from '../config/apiConfig.js';

const { Drop, Nft, Op, NftPurchaseHistory, Notification } = db;

export const mintNft = async (request) => {
	try {
		const { payload, user } = request;

		const rawData = {
			dropId: payload?.dropId,
			dropAddress: payload?.dropAddress,
			walletAddress: payload?.walletAddress,
			metaData: payload?.metaData,
			totalQuantity: payload?.totalQuantity,
			availQuantity: payload?.availQuantity,
			tokenId: payload?.tokenId,
			directListId: payload?.directListId,
			pricePerToken: payload?.pricePerToken,
		};
		const [err, validatedData] = await mintNftValidator(rawData);
		if (err) {
			return err;
		}
		const insertedData = {
			userId: user.id,
			dropId: validatedData?.dropId,
			dropAddress: validatedData?.dropAddress,
			walletAddress: validatedData?.walletAddress,
			metaData: validatedData?.metaData,
			totalQuantity: validatedData?.totalQuantity,
			availQuantity: validatedData?.availQuantity,
			tokenId: validatedData?.tokenId,
			directListId: validatedData?.directListId,
			pricePerToken: validatedData?.pricePerToken,
		};

		const nftData = await Nft.create(insertedData);
		return {
			status: 200,
			data: {},
			message: 'Nft minted successfully',
			error: {},
		};
	} catch (e) {
		return { status: 500, data: [], error: { message: 'Something went wrong !', reason: e.message } };
	}
};

export const listMyNft = async (request) => {
	try {
		const { payload, user } = request;

		const limit = 12;
		const page = payload?.page || 1;
		const offset = (page - 1) * limit;

		const { count, rows } = await Nft.findAndCountAll({
			where: { dropAddress: payload.dropAddress, walletAddress: payload.walletAddress, userId: user.id },
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
			message: 'Records fetched',
			error: {},
		};
	} catch (e) {
		return { status: 500, data: [], error: { message: 'Something went wrong !', reason: e.message } };
	}
};

export const myNftDetails = async (request) => {
	try {
		const { payload, user } = request;
		const nftDetails = await Nft.findOne({ where: { id: payload?.id } });

		return {
			status: 200,
			data: nftDetails,
			message: 'Record fetched',
			error: {},
		};
	} catch (e) {
		return { status: 500, data: [], error: { message: 'Something went wrong !', reason: e.message } };
	}
};

export const buyNft = async (request) => {
	try {
		const { payload, user } = request;

		const nftDetails = await Nft.findOne({ where: { id: payload?.nftId } });

		const insertedData = {
			userId: user.id,
			nftId: payload.nftId,
			walletAddress: payload.walletAddress,
			quantity: payload.quantity,
			pricePerToken: nftDetails.pricePerToken,
		};



		await NftPurchaseHistory.create(insertedData);
		const meta = JSON.parse(JSON.parse(nftDetails?.metaData));

		//============ Create new notification =====================//

		await Notification.create({
			fromId: user.id,
			toId: nftDetails.userId,
			isRead: 0,
			message:
				`Bought ntf  ${meta?.name}`,
		});

		await Notification.create({
			fromId: user.id,
			toId: 1,
			isRead: 0,
			message:
				`Bought ntf  ${meta?.name}`,
		});
		//=============== end new notification ======================//
		const qty = parseInt(nftDetails.availQuantity) - parseInt(payload.quantity);
		await Nft.update({ availQuantity: qty }, { where: { id: payload?.nftId } });
		return {
			status: 200,
			data: {},
			message: 'Record fetched',
			error: {},
		};
	} catch (e) {
		return { status: 500, data: [], error: { message: 'Something went wrong !', reason: e.message } };
	}
};
