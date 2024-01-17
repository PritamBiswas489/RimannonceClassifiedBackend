import db from '../databases/models/index.js';
import '../config/environment.js';
const { User, Op, Page, Nft, Product, ArtistType, BlogLike, PageAccess, Drop, NftPurchaseHistory, UserAccount, Order, OrderShipping, OrderProduct, Blog, Comment, sequelize,  Favorite } = db;

const { STRIPE_API_KEY, STRIPE_SECRET_KEY, FRONT_BASE_URL } = process.env;

import Stripe from 'stripe';
const stripe = Stripe(STRIPE_SECRET_KEY);

export const pageDetails = async (request) => {
	try {
		const {
			payload: { userName, pageId },
		} = request;

		const userDetails = await User.findOne({
			where: { userName: userName },
			raw: true,
		});

		const pageDetails = await Page.findOne({
			where: { uuid: pageId },
			include: {
				model: User,
				where: {
					userName: userName,
				},
			},
		});
		const products = await Product.findAll({ where: { userId: userDetails?.id, status: 1 }, limit: 15 });

		return {
			status: 200,
			data: { pageDetails, products },
			message: 'Records fetched',
			error: {},
		};
	} catch (e) {
		return { status: 500, data: [], error: { message: 'Something went wrong !', reason: e.message } };
	}
};

export const getUserProfile = async (request) => {
	try {
		const {
			payload: { userName },
		} = request;

		const limit = 6;

		const userDetails = await User.findOne({
			where: { userName: userName },
		});
		const pages = await Page.findAll({
			where: { userId: userDetails?.id },
			limit: limit,
		});
		const nfts = await Nft.findAll({
			where: { userId: userDetails?.id },
			limit: limit,
		});

		const products = await Product.findAll({
			where: { userId: userDetails?.id },
			limit: limit,
		});

		return {
			status: 200,
			data: { userDetails, pages, nfts, products },
			message: 'Records fetched',
			error: {},
		};
	} catch (e) {
		return { status: 500, data: [], error: { message: 'Something went wrong !', reason: e.message } };
	}
};

export const getNftDetails = async (request) => {
	try {
		const { payload } = request;
		const userDetails = await User.findOne({
			where: { userName: payload?.userName },
		});
		const nftDetails = await Nft.findOne({ where: { uuid: payload?.id, userId: userDetails?.id } });
		 
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

export const getNftListByPage = async  (request) => {
	
	try {
		const { payload } = request;
		const pageId = payload?.pageId;
		const userDetails = await User.findOne({
			where: { userName: payload?.userName },
			raw: true,
		});

		const limit = 12;
		const page = payload?.page || 1;
		const offset = (page - 1) * limit;

		
		const { count, rows } = await PageAccess.findAndCountAll({
			where: { pageId: payload.pageId, userId: userDetails?.id },
			include: [
				{
					model: Drop,
				},
				{
					model: Nft,
				},
			],
			raw: true,
			 offset: offset, 
			 limit: limit
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
	

}

export const getNftList = async (request) => {
	try {
		const { payload } = request;
		const userDetails = await User.findOne({
			where: { userName: payload?.userName },
			raw: true,
		});

		const limit = 12;
		const page = payload?.page || 1;
		const offset = (page - 1) * limit;

		const { count, rows } = await Nft.findAndCountAll({ where: { userId: userDetails?.id }, offset: offset, limit: limit });

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

export const getProductList = async (request) => {
	try {
		const { payload } = request;
		const userDetails = await User.findOne({
			where: { userName: payload?.userName },
			raw: true,
		});

		const limit = 12;
		const page = payload?.page || 1;
		const offset = (page - 1) * limit;

		const { count, rows } = await Product.findAndCountAll({ where: { userId: userDetails?.id, status: 1 }, offset: offset, limit: limit });

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

export const getPageList = async (request) => {
	try {
		const { payload } = request;
		const userDetails = await User.findOne({
			where: { userName: payload?.userName },
			raw: true,
		});

		const limit = 12;
		const page = payload?.page || 1;
		const offset = (page - 1) * limit;

		const { count, rows } = await Page.findAndCountAll({ 
			where: { userId: userDetails?.id, type: 'PUBLIC' }, 
			attributes: {
				include: [
					[sequelize.literal('(SELECT COUNT(*) FROM page_access WHERE page_access.page_id = Page.id)'), 'accessCount'],
				    
			    ],
			},
			offset: offset, limit: limit });

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

export const productDetails = async (request) => {
	try {
		const {
			payload: { userName, id },
		} = request;

		const productDetails = await Product.findOne({
			where: { uuid: id },
			include: {
				model: User,
				where: {
					userName: userName,
				},
			},
		});

		return {
			status: 200,
			data: productDetails,
			message: 'Records fetched',
			error: {},
		};
	} catch (e) {
		return { status: 500, data: [], error: { message: 'Something went wrong !', reason: e.message } };
	}
};

export const getPageAccess = async (request) => {
	try {
		const { payload, user } = request;
		const pageDetails = await Page.findOne({
			where: { uuid: payload.pageId },
			raw: true,
		});
		const pageAccessData = await PageAccess.findAll({
			where: { pageId: pageDetails.id },
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

		console.log('pageAccessData :>> ', pageAccessData);

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

export const nftOwnerVerification = async (request) => {
	try {
		const {
			payload: { nftIds, walletAddress },
		} = request;

		
		

		const nftOwnerData = await NftPurchaseHistory.findAll({
			where: { nftId: { [Op.in]: nftIds }, walletAddress: walletAddress },
			raw: true,
		});

		return {
			status: 200,
			data: nftOwnerData,
			message: 'Records fetched',
			error: {},
		};
	} catch (e) {
		return { status: 500, data: [], error: { message: 'Something went wrong !', reason: e.message } };
	}
};

export const stripeWebhook = async (request) => {
	try {
		const { payload } = request;

		if (payload.type == 'account.updated') {
			const accountId = payload.data.object.id;
			const { card_payments, transfers } = payload.data.object.capabilities;

			if (card_payments === 'active' && transfers === 'active') {
				const userAccountData = await UserAccount.findOne({ where: { stripeAccountId: accountId }, raw: true });
				const userId = userAccountData.userId;
				await UserAccount.update({ status: 'COMPLETE' }, { where: { id: userAccountData?.id } });
				await User.update({ role: 'BOTH' }, { where: { id: userId } });
			}
		}

		return {
			status: 200,
			data: {},
			message: 'account created',
			error: {},
		};
	} catch (e) {
		return { status: 500, data: [], error: { message: 'Something went wrong !', reason: e.message } };
	}
};

export const getFavArtistList = async (request) => {
	try {
		const { payload } = request;
		const { u_id } = payload;
		const favorites = await Favorite.findAll({ where: { userId: u_id }, attributes: ['artistId'], raw: true });
		return {
			status: 200,
			data: favorites,
			message: 'Record fetched',
			error: {},
		};
		} catch (e) {
			return { status: 500, data: [], error: { message: 'Something went wrong !', reason: e.message } };
		}


}
export const getFavArtistListing = async (request) => {
	try {
		const { payload } = request;
        const user_id = payload.u_id;
		const limit = 12;
		const page = payload?.page || 1;
		const searchValue = payload?.s || '';
		const offset = (page - 1) * limit;
		const whereConditions = {
			[Op.and]: [
			  { userId: { [Op.eq]: user_id } }  
			]
		  };
		  if (searchValue) {
			whereConditions[Op.and].push({
				'$artistUser.name$': {
					[Op.like]: `%${searchValue}%`
				}
			});
	     }
		
		const { count, rows } = await Favorite.findAndCountAll({
			where: whereConditions,
			include: [
				{
					model: User,
					as: 'artistUser',
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
}

export const getArtistList = async (request) => {
	try {
		const { payload } = request;
		const limit = 12;
		const page = payload?.page || 1;
		const searchValue = payload?.s || '';
		const offset = (page - 1) * limit;
		const sqlCondition = `(SELECT COUNT(*) FROM pages WHERE pages.user_id = User.id) > 0`;
		const whereConditions = {
			[Op.and]: [
			  sequelize.literal(sqlCondition),
			  { role: { [Op.not]: 'ADMIN' } }  
			]
		  };
		  if (searchValue) {
				whereConditions[Op.and].push({
					name: {
						[Op.like]: `%${searchValue}%`
					}
				});
		  }
		const { count, rows } = await User.findAndCountAll({
			 
			where: whereConditions,
			offset: offset,
			limit: limit,
			order: [['isPromoted', 'DESC']],
			raw: true  
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

}

export const getHomeArtistList = async (request) => {
	try {
		const { payload } = request;
		const limit = 6;
		const page = payload?.page || 1;
		const searchValue = payload?.s || '';
		const offset = (page - 1) * limit;
		const sqlCondition = `(SELECT COUNT(*) FROM pages WHERE pages.user_id = User.id) > 0`;
		const whereConditions = {
			[Op.and]: [
			  sequelize.literal(sqlCondition),
			  { role: { [Op.not]: 'ADMIN' } }  
			]
		  };
		  if (searchValue) {
				whereConditions[Op.and].push({
					name: {
						[Op.like]: `%${searchValue}%`
					}
				});
		  }
		const { count, rows } = await User.findAndCountAll({
			include: [
				{
					model: ArtistType,
					as: 'artistTypeDetail',
				},
			],
			 
			where: whereConditions,
			offset: offset,
			limit: limit,
			order: [['isPromoted', 'DESC']],
			raw: true  
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

}

export const getUserList = async (request) => {
	try {
		const { payload } = request;

		const limit = 12;
		const page = payload?.page || 1;
		const offset = (page - 1) * limit;

		const { count, rows } = await User.findAndCountAll({ where: { role: { [Op.ne]: 'ADMIN' } }, offset: offset, limit: limit });

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

export const listBlog = async (request) => {
	try {
		const { payload } = request;

		const limit = 15;
		const page = payload?.page || 1;
		const offset = (page - 1) * limit;

		const { count, rows } = await Blog.findAndCountAll({
			where: { status: 'ACTIVE' },
			attributes: {
				include: [
					[sequelize.literal('(SELECT COUNT(*) FROM comments WHERE comments.blog_id = Blog.id)'), 'commentCount'],
				    [sequelize.literal('(SELECT COUNT(*) FROM blog_likes WHERE blog_likes.blog_id = Blog.id)'), 'likeCount']
			],
				
				exclude: ['comments'], // Exclude the comments attribute from the main model attributes
			},
			offset: offset,
			limit: limit,
			order: [['id', 'DESC']],
			include: [
				{
					model: User,
					as: 'blogOwner',
					where: { userName: payload?.userName },
				},
			],
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

export const blogDetails = async (request) => {
	try {
		const { payload } = request;

		const blogData = await Blog.findOne({
			where: {
				[Op.or]: [
					{ id: payload.id },
					{ uuid: payload.id },
				],
			},
			include: [
				{
					model: User,
					as: 'blogOwner',
				},
				{
					model: Comment,
					as: 'comments',
					include: [
						{
							model: User,
							as: 'commentedBy',
						},
					],
				},
			],
			order: [['comments', 'id', 'desc']],
		});

		return {
			status: 200,
			data: blogData,
			message: 'Records fetched',
			error: {},
		};
	} catch (e) {
		return { status: 500, data: [], error: { message: 'Something went wrong !', reason: e.message } };
	}
};

export const getNftBuyer = async (request) => {
	try {
		const { payload, user } = request;
		const userDetails = await User.findOne({
			where: { userName: payload?.userName },
			raw: true,
		});
		const nfts = await Nft.findAll({ where: { userId: userDetails?.id }, attributes: ['id'], raw: true });

		const nftIds = nfts.map((val) => val.id);
		console.log('nftIds :>> ', nftIds);
		const nftBuyer = await NftPurchaseHistory.findAll({ where: { nftId: { [Op.in]: nftIds } }, attributes: ['userId'], raw: true });
		console.log('nftBuyer :>> ', nftBuyer);
		const nftBuyerId = nftBuyer.map((val) => val.userId);
		return {
			status: 200,
			data: [...nftBuyerId, userDetails?.id],
			message: 'Records fetched',
			error: {},
		};
	} catch (e) {
		return { status: 500, data: [], error: { message: 'Something went wrong !', reason: e.message } };
	}
};

export const getLikeData = async (request) => {
    try {
        const {
			payload,
            user
		} = request;

         
        const countData = await BlogLike.count({
			where: { blogId: payload?.blogId },
		});
       
		return {
			status: 200,
			data: {countData},
			message: 'Success',
			error: {},
		};
	} catch (e) {
		return { status: 500, data: [], error: { message: 'Something went wrong !', reason: e.message } };
	}

}
