import db from '../databases/models/index.js';
import { default as api } from '../config/apiConfig.js';
const { Announcement,User, AnnouncementMedia, Favorites, Op, Settings, sequelize } = db;

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
		//============= get user wallet amount  =================//

		const getUserWalletAmount = await User.findOne({ where: { id: user.id }, attributes: [
			'walletAmount'
		
		] });

        const { walletAmount } = getUserWalletAmount;
		let userWalletAmount = parseFloat(walletAmount);

		if(parseInt(payload?.isPremium) === 1){
			//============= get catgeory post amount =================//
			let postCategoryAmount = 0;
			if(payload?.category === 'car'){
				const getSettings = await Settings.findOne({ where: { keyValue: 'car_premium_price' }});
				postCategoryAmount = parseFloat(getSettings.dataValue);
			}
			if(payload?.category ===   'apartment'){
				const getSettings = await Settings.findOne({ where: { keyValue: 'apartment_premium_price' }});
				postCategoryAmount = parseFloat(getSettings.dataValue);
				
			}
			if(payload?.category === 'gp_delivery'){
				const getSettings = await Settings.findOne({ where: { keyValue: 'gb_delivery_premium_price' }});
				postCategoryAmount = parseFloat(getSettings.dataValue);
				
			}
			if(payload?.category === 'land_sale'){
				const getSettings = await Settings.findOne({ where: { keyValue: 'land_sale_premium_price' }});
				postCategoryAmount = parseFloat(getSettings.dataValue);
				
			}
            //============= checking user have amount to post =======//
			if(userWalletAmount < postCategoryAmount){
				return { status: 500, data: {requestWallet:1}, error: { message: `Your waller need  minimum $${postCategoryAmount} to post this announcement` } };

			}

			//============ user wallet amount after deduct =======================//

			userWalletAmount = userWalletAmount - postCategoryAmount

		}

		const createData = await Announcement.create(announcementData);
		if (createData?.id) {
			if(parseInt(payload?.isPremium) === 1){
				await User.update(
					{ walletAmount: userWalletAmount },
					{
						where: {
							id: user.id,
						},
					}
				);
				///================= Insert into transaction table ====================////
			}
            

			const promises = files.map(async (data, index) => {
				const mediaData = {
					announcementId: createData?.id,
					filePath: data.path,
					fileType: data.fileType,
				};
				return await AnnouncementMedia.create(mediaData);
			});
			const resolvedData = await Promise.all(promises);

			const getUsrWalletAmt = await User.findOne({ where: { id: user.id }, attributes: [
				'walletAmount'
			
			] });
			const { walletAmount } = getUsrWalletAmt;
			return {
				status: 200,
				data: {walletAmount,createData},
				message: 'Announcement created successfully',
				error: {},
			};
		} else {
			return { status: 500, data: [], error: { message: 'Failed !' } };
		}
	} catch (e) {
		console.log( e.message);
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
			attributes: {
				include: [
					[ sequelize.literal('(SELECT file_path FROM announcement_medias WHERE file_type = "images" AND announcement_medias.announcement_id = Announcement.id LIMIT 1)'), 'media'],   
			    ],
			},
			
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
export const myAnnouncementListing = async (request) =>{
	try {
		const { payload , user} = request;
		const limit = 15;
		const page = payload?.page || 1;
		const offset = (page - 1) * limit;

		const { count, rows } = await Announcement.findAndCountAll({
			where: { createdBy: user.id },
			attributes: {
				include: [
					[ sequelize.literal('(SELECT file_path FROM announcement_medias WHERE file_type = "images" AND announcement_medias.announcement_id = Announcement.id LIMIT 1)'), 'media'],   
			    ],
			},
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
export const myFavoriteAnnouncementListing = async (request) =>{
	try {
		const { payload, user } = request;
		const limit = 15;
		const page = payload?.page || 1;
		const offset = (page - 1) * limit;

		const { count, rows } = await Favorites.findAndCountAll({
			offset: offset,
			limit: limit,
			order: [['id', 'DESC']],
			where: { addedBy: user.id },
			include: [
				{
					model: Announcement,
					as: 'favoritesAnnouncement',
					where: { status: 'ACTIVE' },
					
					attributes: {
						include: [
							[ sequelize.literal('(SELECT file_path FROM announcement_medias WHERE file_type = "images" AND announcement_medias.announcement_id = favoritesAnnouncement.id LIMIT 1)'), 'media'],   
						],
					},
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
