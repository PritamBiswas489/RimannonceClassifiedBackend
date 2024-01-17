import db from '../databases/models/index.js';
const { STRIPE_API_KEY, STRIPE_SECRET_KEY, FRONT_BASE_URL } = process.env;

import Stripe from 'stripe';
const stripe = Stripe(STRIPE_SECRET_KEY);

const { User, Op, UserAccount, Product, Order, OrderPayment, OrderProduct, OrderShipping, Favorite } = db;

export const getAuthUser = async (request) => {
	try {
		const { user } = request;
		const userDetails = await User.findOne({ where: { id: user.id } });

		return {
			status: 200,
			message: 'Record fetched !',
			data: {
				user: userDetails,
			},
		};
	} catch (e) {
		return { status: 500, data: [], error: { message: 'Something went wrong !', reason: e.message } };
	}
};

export const switchToAccount = async (request) => {
	try {
		const { payload, user } = request;

		await User.update(
			{ loggedInAs: payload?.loggedInAs },
			{
				where: {
					id: user.id,
				},
			}
		);

		return {
			status: 200,
			message: 'Account Switched !',
			data: {},
		};
	} catch (e) {
		return { status: 500, data: [], error: { message: 'Something went wrong !', reason: e.message } };
	}
};
export const artistAddToFav = async (request)=>{
	try {
		const { payload, user } = request;
		const { artist_id, action} = payload;
		const {id:user_id} = user;
		if(action === 'add'){
			const response = await Favorite.create({ userId: user_id, artistId: artist_id });
		}
		if(action === 'remove'){
			const response = await Favorite.destroy({
				where: { userId: user_id, artistId: artist_id },
			  });
		}

		return {
			status: 200,
			message: 'Successfully marked as favorite !',
			data: {artist_id, action, user_id},
		};
	} catch (e) {
		return { status: 500, data: [], error: { message: 'Something went wrong !', reason: e.message } };
	}

}

export const createStripeExpressAcount = async (request) => {
	try {
		const { payload, user } = request;

		// const token = await stripe.tokens.create({
		// 	card: {
		// 		number: '4242424242424242',
		// 		exp_month: 7,
		// 		exp_year: 2024,
		// 		cvc: '314',
		// 	},
		// });
		// const token = await stripe.tokens.create({
		// 	bank_account: {
		// 		country: 'US',
		// 		currency: 'usd',
		// 		account_holder_name: 'Jenny Rosen',
		// 		account_holder_type: 'individual',
		// 		routing_number: '110000000',
		// 		account_number: '000123456789',
		// 	},
		// });
		const userAccount = await UserAccount.findOne({ where: { userId: user.id }, raw: true });
		var accountId = 0;
		if (!userAccount) {
			const account = await stripe.accounts.create({
				country: 'US',
				type: 'express',
				business_type: 'individual',
				capabilities: {
					card_payments: {
						requested: true,
					},
					transfers: {
						requested: true,
					},
				},
				// external_account: token.id,
			});
			accountId = account.id;
			await UserAccount.create({ userId: user.id, stripeAccountId: accountId });
		} else {
			accountId = userAccount.stripeAccountId;
		}

		const accountLink = await stripe.accountLinks.create({
			account: accountId,
			refresh_url: `${FRONT_BASE_URL}/account-success`,
			return_url: `${FRONT_BASE_URL}/account-success`,
			type: 'account_onboarding',
		});

		return {
			status: 200,
			message: 'Account ',
			data: accountLink,
		};
	} catch (e) {
		return { status: 500, data: [], error: { message: 'Something went wrong !', reason: e.message } };
	}
};

export const myOrderList = async (request) => {
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
