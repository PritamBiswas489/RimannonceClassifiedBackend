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
export const getListGlobal = async (request) => {
	try {
		const { payload } = request;
		const limit = 15;
		const page = payload?.page || 1;
		const cat = payload?.cat;
		const search = payload?.search;
		const offset = (page - 1) * limit;

		const whereData = { status: 'ACTIVE', isPremium : 0 };
		if(cat!==''){
			whereData.category = cat;
		}
		if (search !== '') {
			// Use sequelize's [Op.or] for a search on title or location
			whereData[ Op.or] = [
			  { title: { [ Op.like]: `%${search}%` } },
			  { location: { [ Op.like]: `%${search}%` } },
			  { subLocation: { [ Op.like]: `%${search}%` } },
			  { gpDeliveryOrigin: { [ Op.like]: `%${search}%` } },
			  { gpDeliveryDestination: { [ Op.like]: `%${search}%` } },
			];
		  }
		const { count, rows } = await Announcement.findAndCountAll({
			where: whereData,
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
export const getListGlobalRand = async (request) =>{
	try {
		const { payload } = request;
		const limit = 6;
		const page = payload?.page || 1;
		const cat = payload?.cat;
		const search = payload?.search;
		const offset = (page - 1) * limit;

		const whereData = { status: 'ACTIVE', isPremium : 0 };
		if(cat!==''){
			whereData.category = cat;
		}
		if (search !== '') {
			// Use sequelize's [Op.or] for a search on title or location
			whereData[ Op.or] = [
			  { title: { [ Op.like]: `%${search}%` } },
			  { location: { [ Op.like]: `%${search}%` } },
			  { subLocation: { [ Op.like]: `%${search}%` } },
			  { gpDeliveryOrigin: { [ Op.like]: `%${search}%` } },
			  { gpDeliveryDestination: { [ Op.like]: `%${search}%` } },
			];
		  }
		const { count, rows } = await Announcement.findAndCountAll({
			where: whereData,
			attributes: {
				include: [
					[ sequelize.literal('(SELECT file_path FROM announcement_medias WHERE file_type = "images" AND announcement_medias.announcement_id = Announcement.id LIMIT 1)'), 'media'],   
			    ],
			},
			
			offset: offset,
			limit: limit,
			order: sequelize.literal('RAND()'),
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
export const getListGetGpApartment = async (request) => {
	try {
		const { payload } = request;
		const limit = 15;
		const page = payload?.page || 1;
		 
		const search = payload?.search;
		const offset = (page - 1) * limit;

		const whereData = { status: 'ACTIVE', isPremium : 1, category: 'apartment' };

		 
		if (search !== '') {
			// Use sequelize's [Op.or] for a search on title or location
			whereData[ Op.or] = [
			  { title: { [ Op.like]: `%${search}%` } },
			  { location: { [ Op.like]: `%${search}%` } },
			  { subLocation: { [ Op.like]: `%${search}%` } },
			  { gpDeliveryOrigin: { [ Op.like]: `%${search}%` } },
			  { gpDeliveryDestination: { [ Op.like]: `%${search}%` } },
			];
		  }

		const { count, rows } = await Announcement.findAndCountAll({
			where: whereData,
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
export const getListGetGpDelivery = async (request) => {
	try {
		const { payload } = request;
		const limit = 15;
		const page = payload?.page || 1;
		const offset = (page - 1) * limit;
		 
		const search = payload?.search;

		const whereData = { status: 'ACTIVE', isPremium : 1, category: 'gp_delivery' };
		 
		if (search !== '') {
			// Use sequelize's [Op.or] for a search on title or location
			whereData[ Op.or] = [
			  { title: { [ Op.like]: `%${search}%` } },
			  { location: { [ Op.like]: `%${search}%` } },
			  { subLocation: { [ Op.like]: `%${search}%` } },
			  { gpDeliveryOrigin: { [ Op.like]: `%${search}%` } },
			  { gpDeliveryDestination: { [ Op.like]: `%${search}%` } },
			];
		  }

		const { count, rows } = await Announcement.findAndCountAll({
			where: whereData,
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
export const getListGetGpCar = async (request) => {
	try {
		const { payload } = request;
		const limit = 15;
		const page = payload?.page || 1;
		const offset = (page - 1) * limit;
		 
		const search = payload?.search;

		const whereData = { status: 'ACTIVE', isPremium : 1, category: 'car' };

		 
		if (search !== '') {
			// Use sequelize's [Op.or] for a search on title or location
			whereData[ Op.or] = [
			  { title: { [ Op.like]: `%${search}%` } },
			  { location: { [ Op.like]: `%${search}%` } },
			  { subLocation: { [ Op.like]: `%${search}%` } },
			  { gpDeliveryOrigin: { [ Op.like]: `%${search}%` } },
			  { gpDeliveryDestination: { [ Op.like]: `%${search}%` } },
			];
		  }

		const { count, rows } = await Announcement.findAndCountAll({
			where: whereData,
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
//get announcement details
export const getAnnouncementDetails = async (request) => {
	try {
		const { payload } = request;
		const anouncementDetails = await Announcement.findOne({ where: { id: payload.id } });
		const { rows:announcementMedias} = await AnnouncementMedia.findAndCountAll({ where: { announcementId: payload.id } });

		return {
			status: 200,
			data: anouncementDetails,
			medias: announcementMedias,
			message: 'Records fetched',
			error: {},
		};
	} catch (e) {
		return { status: 500, data: [], error: { message: 'Something went wrong !', reason: e.message } };
	}

}
//get announcement media 
export const getAnnouncementMediaList = async (request) => {
	    const { payload } = request;
		const { rows } = await AnnouncementMedia.findAndCountAll({ where: { id: payload.id } });
		const data = {
			records: rows,
		};
		return {
			status: 200,
			data: data,
			message: 'Records fetched',
			error: {},
		};
}