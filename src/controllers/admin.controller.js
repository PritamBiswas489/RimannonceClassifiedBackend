import db from '../databases/models/index.js';
import '../config/environment.js';
import { hashStr } from '../libraries/auth.js';
import { smtpConnection } from '../config/mail.config.js';
import { resolve as pathResolve, dirname, join as pathJoin } from 'path';
import { generateHtmlTemplate } from '../libraries/utility.js';
const { ACCESS_TOKEN_SECRET_KEY, REFRESH_TOKEN_SECRET_KEY, JWT_ALGO, ACCESS_TOKEN_EXPIRES_IN, REFRESH_TOKEN_EXPIRES_IN, MAIL_FROM, NODE_ENV } = process.env;

const { User, Settings,  TransactionsAdmin, Favorites, Transactions, AnnouncementMedia, Product, Cart, Order, OrderShipping, OrderProduct, Op, Sequelize, Locations, SubLocations, Announcement, ContactUs, Categories  } = db;

export const updateUserEmail = async (request) => {
	try {
		const { payload } = request;
		const { email, user_id } = payload;
		const userDetails = await User.findOne({
			where: {
				email: email,
				id: {
					[Sequelize.Op.not]: user_id,
				},
			},
		});
		if (userDetails) {
			throw new Error('Email already used for other user.');
		}
		await User.update(
			{ email: email },
			{
				where: {
					id: user_id,
				},
			}
		);
		return {
			status: 200,
			data: { success: 1 },
			message: 'Record fetched',
			error: {},
		};
	} catch (e) {
		return { status: 500, data: [], error: { message: e?.message || 'Something went wrong !', reason: e.message } };
	}
};
export const userChangeStatus = async (request) => {
	try {
		const { payload } = request;
		const {  user_id, isUserActive } = payload;

		await User.update(
			{
				status:isUserActive=== 'true' ? 'INACTIVE' : 'ACTIVE',
			},
			{
				where: {
					id: user_id,
				},
			}
		);
		return {
			status: 200,
			data: { success: 1 },
			message: 'Record fetched',
			error: {},
		};

	}catch (e) {
		return { status: 500, data: [], error: { message: 'Something went wrong !', reason: e.message } };
	}


}


export const announcementChangeStatus = async (request) => {
	try {
		const { payload } = request;
		const {  id, isUserActive } = payload;

		await Announcement.update(
			{
				status:isUserActive=== 'true' ? 'INACTIVE' : 'ACTIVE',
			},
			{
				where: {
					id: id,
				},
			}
		);
		return {
			status: 200,
			data: { success: 1 },
			message: 'Record fetched',
			error: {},
		};

	}catch (e) {
		return { status: 500, data: [], error: { message: 'Something went wrong !', reason: e.message } };
	}


}


export const deleteUser  = async (request) => {
	
	try {
		const { payload } = request;
		const {  user_id } = payload;

		const userData = await User.findOne({ where: { id: user_id },
			include: [
				{
					model: Announcement,
					as: 'userAnnouncements',
					include: [
						{
							model: AnnouncementMedia,
							as: 'announcementMedias',
						},
					],
				},
				 
			],
		});

		if(userData.userAnnouncements.length > 0){
			userData?.userAnnouncements.forEach(async (aData,aIndex)=>{
				if(aData.announcementMedias.length > 0){
					aData.announcementMedias.forEach(async (aDataMedia,aIndexMedia)=>{
							const deleteFile  = await deleteExistingAvatar(aDataMedia.filePath);
							await AnnouncementMedia.destroy({ where: { id: aDataMedia.id } });
					})
				}
				await Announcement.destroy({ where: { id: aData.id } });
			})
		}
		await Favorites.destroy({ where: { addedBy: userData.id } });
		await TransactionsAdmin.destroy({ where: { userId: userData.id } });
		await Transactions.destroy({ where: { userId: userData.id } });
        await User.destroy({ where: { id: userData?.id } });
		
		return {
			status: 200,
			data: {delete:1},
			message: 'User account deleted permanently',
			error: {},
		};

	}catch (e) {
		return { status: 500, data: [], error: { message: 'Something went wrong !', reason: e.message } };
	}


}

export const deleteLocation = async (request) => {
	try {
		const { payload } = request;
		const {  id } = payload;
		await Locations.destroy({ where: { id: id } });
		return {
			status: 200,
			data: {delete:1},
			message: 'Location deleted permanently',
			error: {},
		};
	}catch (e) {
		return { status: 500, data: [], error: { message: 'Something went wrong !', reason: e.message } };
	}

}
export const deleteContactUs =  async (request) => {
	try {
		const { payload } = request;
		const {  id } = payload;
		await ContactUs.destroy({ where: { id: id } });
		return {
			status: 200,
			data: {delete:1},
			message: 'Contact us message deleted permanently',
			error: {},
		};
	}catch (e) {
		return { status: 500, data: [], error: { message: 'Something went wrong !', reason: e.message } };
	}

}
//sendContactUsEmail

export const sendContactUsEmail =  async (request) => {
	try {
		const { payload } = request;
		const {  name  ,
			email,
			subject,
			message, } = payload;
			const connection = smtpConnection();
			 
			const htmlPath =
				NODE_ENV === 'development' ? pathResolve(pathJoin(dirname('./'), 'src/view/email/emailreply.html')) : pathResolve(pathJoin(dirname('./'), '..', 'src/view/email/newpassword.html'));
			const htmlToSend = await generateHtmlTemplate(htmlPath, { message });
			const mailOptions = {
				from: MAIL_FROM,
				to: email,
				subject: subject,
				html: htmlToSend,
				attachments: [
					{
						filename: 'logo.jpg',
						path:
							NODE_ENV === 'development'
								? pathResolve(pathJoin(dirname('./'), 'public/images/logo.jpg'))
								: pathResolve(pathJoin(dirname('./'), '..', 'public/images/logo.jpg')),
						cid: 'unique@logo', 
					},
				],
			};
			connection.sendMail(mailOptions);
		return {
			status: 200,
			data: {delete:1},
			message: 'Message sent successfully',
			error: {},
		};
	}catch (e) {
		return { status: 500, data: [], error: { message: 'Something went wrong !', reason: e.message } };
	}

}

export const updateLocation = async (request) => {
	try {
		const { payload } = request;
		const {  id,  name, frName, arName } = payload;

		await Locations.update(
			{
				name,
				frName,
				arName

			},
			{
				where: {
					id: id,
				},
			}
		);
		return {
			status: 200,
			data: { success: 1 },
			message: 'Record fetched',
			error: {},
		};

	}catch (e) {
		return { status: 500, data: [], error: { message: 'Something went wrong !', reason: e.message } };
	}


}
export const updateSubLocation  = async (request) => {
	try {
		const { payload } = request;
		const {  id,  name, frName, arName } = payload;

		await SubLocations.update(
			{
				name,
				frName,
				arName

			},
			{
				where: {
					id: id,
				},
			}
		);
		return {
			status: 200,
			data: { success: 1 },
			message: 'Record fetched',
			error: {},
		};

	}catch (e) {
		return { status: 500, data: [], error: { message: 'Something went wrong !', reason: e.message } };
	}

}

export const deleteSubLocation = async (request) => {
	try {
		const { payload } = request;
		const {  id } = payload;
		await SubLocations.destroy({ where: { id: id } });
		return {
			status: 200,
			data: {delete:1},
			message: 'Sub Location deleted permanently',
			error: {},
		};
	}catch (e) {
		return { status: 500, data: [], error: { message: 'Something went wrong !', reason: e.message } };
	}

}

export const getUserTransactions = async (request) => {
	try {
		const { payload } = request;
		const {  user_id } = payload;

		const { count, rows } = await Transactions.findAndCountAll({ 
		   	  where: { userId: user_id } ,
			  order: [['id', 'DESC']],
			  include: [
				{
					model: Announcement,
					as: 'transactionAnnouncement',
				},
				 
			],
			
			
			},
			  
			  
			 
			  );
			  

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
export const getAdminTransactions = async (request) => {
 
	try {
		const { payload } = request;
		const {  user_id } = payload;

		const { count, rows } = await TransactionsAdmin.findAndCountAll({ 
		   	  where: { userId: user_id } ,
			  order: [['id', 'DESC']] });

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
export const updateUserPassword = async (request) => {
	try {
		const { payload } = request;
		const { password, user_id } = payload;
		await User.update(
			{
				password: await hashStr(password),
			},
			{
				where: {
					id: user_id,
				},
			}
		);
		return {
			status: 200,
			data: { success: 1 },
			message: 'Record fetched',
			error: {},
		};
	} catch (e) {
		return { status: 500, data: [], error: { message: 'Something went wrong !', reason: e.message } };
	}
};

export const setPromote = async (request) => {
	try {
		const { payload } = request;
		const user_id = payload?.user_id || 0;
		const userDetails = await User.findOne({ where: { id: user_id } });

		if (userDetails.isPromoted === 1) {
			await User.update(
				{ isPromoted: 0 },
				{
					where: {
						id: user_id,
					},
				}
			);
		} else {
			await User.update(
				{ isPromoted: 1 },
				{
					where: {
						id: user_id,
					},
				}
			);
		}

		return {
			status: 200,
			data: { user_id },
			message: 'Record fetched',
			error: {},
		};
	} catch (e) {
		return { status: 500, data: [], error: { message: 'Something went wrong !', reason: e.message } };
	}
};
export const announcmentList = async (request) => {
	try {
		const { payload } = request;
		const limit = 15;
		const page = payload?.page || 1;
		const cat = payload?.cat || '';
		const locationids = payload?.locationids ? JSON.parse(payload?.locationids) : [];
		const search = payload?.s;
		const offset = (page - 1) * limit;
	

		const whereData = { };
		if (cat !== '') {
			whereData.category = cat;
		}
		if (search !== '') {
			// Use sequelize's [Op.or] for a search on title or location
			whereData[Op.or] = [
				{ title: { [Op.like]: `%${search}%` } },
				{ location: { [Op.like]: `%${search}%` } },
				{ subLocation: { [Op.like]: `%${search}%` } },
				{ gpDeliveryOrigin: { [Op.like]: `%${search}%` } },
				{ gpDeliveryDestination: { [Op.like]: `%${search}%` } },
			];
		}
		if (locationids && locationids.length > 0) {
			// Include condition for locationids
			whereData.locationId = { [Op.in]: locationids };
		}
		const { count, rows } = await Announcement.findAndCountAll({
			where: whereData,
			attributes: {
				include: [
					[
						Sequelize.literal(
							'(SELECT file_path FROM announcement_medias WHERE file_type = "images" AND announcement_medias.announcement_id = Announcement.id LIMIT 1)'
						),
						'media',
					],
				],
			},
			include: [
				{
					model: Locations,
					as: 'announcementLocation',
				},
				{
					model: SubLocations,
					as: 'announcementSubLocation',
				},
				{
					model:User,
					as:'announcementUser'
				}
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
export const categories =  async (request) => {
	try {
		const { payload } = request;

		const limit = 15;
		const page = payload?.page || 1;
		const search = payload?.s || '';
		const offset = (page - 1) * limit;

		let whereData = {  };

		if (search !== '') {
			whereData[Op.or] = [{ name: { [Op.like]: `%${search}%` } }];
		}

		const { count, rows } = await Categories.findAndCountAll({ 
			where: whereData, 
			offset: offset, limit: limit, order: [['id', 'DESC']] });

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
			message: 'Record fetched',
			error: {},
		};
	} catch (e) {
		return { status: 500, data: [], error: { message: 'Something went wrong !', reason: e.message } };
	}

}
export const locations =  async (request) => {
	try {
		const { payload } = request;

		const limit = 15;
		const page = payload?.page || 1;
		const search = payload?.s || '';
		const offset = (page - 1) * limit;

		let whereData = {  };

		if (search !== '') {
			whereData[Op.or] = [{ name: { [Op.like]: `%${search}%` } }];
		}

		const { count, rows } = await Locations.findAndCountAll({ 
			where: whereData, 
			offset: offset, limit: limit, order: [['id', 'DESC']] });

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
			message: 'Record fetched',
			error: {},
		};
	} catch (e) {
		return { status: 500, data: [], error: { message: 'Something went wrong !', reason: e.message } };
	}

}
export const subLocations =  async (request) => {
	try {
		const { payload } = request;

		const limit = 15;
		const page = payload?.page || 1;
		const search = payload?.s || '';
		const offset = (page - 1) * limit;

		let whereData = {  };

		if (search !== '') {
			whereData[Op.or] = [{ name: { [Op.like]: `%${search}%` } }];
		}

		const { count, rows } = await SubLocations.findAndCountAll({ 
			where: whereData, 
			include: [
				{
					model: Locations,
					as: 'locationSublocation',
				},
				 
			],
			offset: offset, limit: limit, order: [['id', 'DESC']] });

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
			message: 'Record fetched',
			error: {},
		};
	} catch (e) {
		return { status: 500, data: [], error: { message: 'Something went wrong !', reason: e.message } };
	}

}


export const contactUstList =  async (request) => {
	 
	try {
		const { payload } = request;

		const limit = 15;
		const page = payload?.page || 1;
		const search = payload?.s || '';
		const offset = (page - 1) * limit;

		let whereData = {  };

		if (search !== '') {
			// Use sequelize's [Op.or] for a search on title or location
			whereData[Op.or] = [{ subject: { [Op.like]: `%${search}%` } }];
		}

		const { count, rows } = await ContactUs.findAndCountAll({ 
			where: whereData, 
			include: [
				{
					model: User,
					as: 'contactUsUser',
				},
				 
			],
			offset: offset, limit: limit, order: [['id', 'DESC']] });

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
			message: 'Record fetched',
			error: {},
		};
	} catch (e) {
		return { status: 500, data: [], error: { message: 'Something went wrong !', reason: e.message } };
	}

}
export const userList = async (request) => {
	try {
		const { payload } = request;

		const limit = 100;
		const page = payload?.page || 1;
		const search = payload?.s || '';
		const offset = (page - 1) * limit;

		let whereData = { role: { [Op.ne]: 'ADMIN' } };

		if (search !== '') {
			// Use sequelize's [Op.or] for a search on title or location
			whereData[Op.or] = [{ name: { [Op.like]: `%${search}%` } }, { email: { [Op.like]: `%${search}%` } }, { phone: { [Op.like]: `%${search}%` } }];
		}

		const { count, rows } = await User.findAndCountAll({ where: whereData, offset: offset, limit: limit, order: [['id', 'DESC']] });

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
			message: 'Record fetched',
			error: {},
		};
	} catch (e) {
		return { status: 500, data: [], error: { message: 'Something went wrong !', reason: e.message } };
	}
};

export const nftList = async (request) => {
	try {
		const { payload } = request;

		const limit = 15;
		const page = payload?.page || 1;
		const offset = (page - 1) * limit;

		const { count, rows } = await Nft.findAndCountAll({ offset: offset, limit: limit, order: [['id', 'DESC']] });

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
			message: 'Record fetched',
			error: {},
		};
	} catch (e) {
		return { status: 500, data: [], error: { message: 'Something went wrong !', reason: e.message } };
	}
};

export const productList = async (request) => {
	try {
		const { payload } = request;

		const limit = 15;
		const page = payload?.page || 1;
		const offset = (page - 1) * limit;

		const { count, rows } = await Product.findAndCountAll({ include: [{ model: User }], offset: offset, limit: limit, order: [['id', 'DESC']] });

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
			message: 'Record fetched',
			error: {},
		};
	} catch (e) {
		return { status: 500, data: [], error: { message: 'Something went wrong !', reason: e.message } };
	}
};

export const orderList = async (request) => {
	try {
		const { payload } = request;

		const limit = 15;
		const page = payload?.page || 1;
		const offset = (page - 1) * limit;

		const { count, rows } = await Order.findAndCountAll({
			include: [
				{
					model: OrderShipping,
				},
				{
					model: OrderProduct,
					include: [
						{
							model: Product,
						},
					],
				},
			],
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
			message: 'Record fetched',
			error: {},
		};
	} catch (e) {
		return { status: 500, data: [], error: { message: 'Something went wrong !', reason: e.message } };
	}
};

export const getAnnouncementFullDetails = async (request) => {
	try {
		const { payload } = request;
		const anouncementDetails = await Announcement.findOne({ where: { id: payload.id },include: [
			 
			{
				model: Locations,
				as: 'announcementLocation',
			},
			{
				model: SubLocations,
				as: 'announcementSubLocation',
			},
			 
		], });
		const { rows: announcementMedias } = await AnnouncementMedia.findAndCountAll({ where: { announcementId: payload.id } });

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

export const updateCategoryDetails = async (request) => {

	try {
		const { payload } = request;

		await Categories.update(
			{ 
				name: payload?.name, 
				frName: payload?.frName, 
				arName: payload?.arName,
				price: payload?.price,
				isPremium: payload?.isPremium=== true ? 1 : 0,
			},
			{
				where: {
					id: payload?.id,
				},
			}
		);
		return {
			status: 200,
			data: { success: 1 },
			message: 'Record fetched',
			error: {},
		};


	}catch (e) {
		return { status: 500, data: [], error: { message: 'Something went wrong !', reason: e.message } };
	}

	

}
export const updateSiteSettings = async (request) => {
	try {
		const { payload } = request;
		await Settings.update(
			{ 
				dataValue: payload?.admin_call_number,  
			},
			{
				where: {
					keyValue: 'admin_call_number',
				},
			}
		);

		await Settings.update(
			{ 
				dataValue: payload?.admin_whatsapp_number,  
			},
			{
				where: {
					keyValue: 'admin_whatsapp_number',
				},
			}
		);
		await Settings.update(
			{ 
				dataValue: payload?.terms_conditions,  
			},
			{
				where: {
					keyValue: 'terms_conditions',
				},
			}
		);

		await Settings.update(
			{ 
				dataValue: payload?.terms_conditions_fr,  
			},
			{
				where: {
					keyValue: 'terms_conditions_fr',
				},
			}
		);

		await Settings.update(
			{ 
				dataValue: payload?.terms_conditions_ar,  
			},
			{
				where: {
					keyValue: 'terms_conditions_ar',
				},
			}
		);

		return {
			status: 200,
			data: { success: 1 },
			message: 'Record fetched',
			error: {},
		};

	}catch (e) {
		return { status: 500, data: [], error: { message: 'Something went wrong !', reason: e.message } };
	}


}

export const getSettings = async (request) => {
	try {
		const { payload  } = request;
        const rows = await Settings.findAll()
        const settingData = {};
        rows.forEach((rowData,rowKey)=>{
            settingData[rowData.keyValue] = rowData.dataValue;
        })
		
		return {
			status: 200,
			data: settingData,
			message: '',
			error: {},
		};
	} catch (e) {
		return { status: 500, data: [], error: { message: 'Something went wrong !', reason: e.message } };
	}



}
