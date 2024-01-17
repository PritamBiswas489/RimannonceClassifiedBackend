import db from '../databases/models/index.js';
import '../config/environment.js';
import { addToCartValidator } from '../validators/cart.validator.js';

const { Drop, Nft, Product, Cart, Op } = db;

export const addToCart = async (request) => {
	try {
		const { payload, user } = request;

		const rawData = {
			productId: payload?.productId,
			quantity: payload?.quantity,
		};
		const [err, validatedData] = await addToCartValidator(rawData);
		if (err) {
			return err;
		}

		const insertedData = {
			userId: user.id,
			productId: validatedData?.productId,
			quantity: validatedData?.quantity,
		};

		const cartData = await Cart.create(insertedData);

		return {
			status: 200,
			data: { cartId: cartData.uuid },
			message: 'Product created successfully',
			error: {},
		};
	} catch (e) {
		return { status: 500, data: [], error: { message: 'Something went wrong !', reason: e.message } };
	}
};

export const removeFromCart = async (request) => {
	try {
		const { payload, user } = request;

		const cartData = await Cart.destroy({ where: { id: payload?.id } });

		return {
			status: 200,
			data: {},
			message: 'Cart item deleted successfully',
			error: {},
		};
	} catch (e) {
		return { status: 500, data: [], error: { message: 'Something went wrong !', reason: e.message } };
	}
};

export const updateCartQuantity = async (request) => {
	try {
		const { payload, user } = request;

		const updatedData = {
			quantity: payload?.quantity,
		};

		const cartData = await Cart.update(updatedData, { where: { id: payload?.id } });

		return {
			status: 200,
			data: {},
			message: 'Cart updated successfully',
			error: {},
		};
	} catch (e) {
		return { status: 500, data: [], error: { message: 'Something went wrong !', reason: e.message } };
	}
};

export const cartList = async (request) => {
	try {
		const { payload, user } = request;

		const cartData = await Cart.findAll({
			where: { userId: user.id },
			include: {
				model: Product,
			},
		});
		return {
			status: 200,
			data: cartData,
			message: 'Record fetched !',
			error: {},
		};
	} catch (e) {
		return { status: 500, data: [], error: { message: 'Something went wrong !', reason: e.message } };
	}
};
