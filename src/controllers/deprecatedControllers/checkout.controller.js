import db from '../databases/models/index.js';
import Stripe from 'stripe';
import { checkoutValidator } from '../validators/checkout.validator.js';

const { User, Op, UserAccount, Cart, Product, Order, OrderPayment, OrderProduct, OrderShipping } = db;
const { STRIPE_API_KEY, STRIPE_SECRET_KEY, FRONT_BASE_URL } = process.env;
// const stripe = Stripe('sk_test_zGwFkAKqd0x9CXXDu9yjmO0d003yxqSWFB');
const stripe = Stripe(STRIPE_SECRET_KEY);

export const checkout = async (request) => {
	try {
		const { payload, user } = request;

		const rawData = {
			name: payload.name,
			email: payload.email,
			phone: payload.phone,
			address1: payload.address1,
			address2: payload.address2,
			city: payload.city,
			state: payload.state,
			country: payload.country,
			postCode: payload.postCode,
			comment: payload.comment,
			privacy: payload.privacy,
			terms: payload.terms,
			cardHolder: payload.cardHolder,
			cardNumber: payload.cardNumber,
			expiryMonth: payload.expiryMonth,
			expiryYear: payload.expiryYear,
			cvv: payload.cvv,
		};
		const [err, validatedData] = await checkoutValidator(rawData);
		if (err) {
			return err;
		}

		const cartData = await Cart.findAll({
			where: { userId: user.id },
			include: [
				{
					model: Product,
					include: [
						{
							model: User,
							include: [
								{
									model: UserAccount,
								},
							],
						},
					],
				},
			],
		});

		const ramdomString = `ORDER-${new Date().getTime()}`;

		let totalAmount = 0;
		const commission = 10;
		let transferData = [];

		let outOfStock = 0;

		for (let i = 0; i < cartData.length; i++) {
			const productDta = await Product.findOne({ where: { id: cartData[i]?.productId } });
			if (productDta.stock < cartData[i]?.quantity) {
				outOfStock = 1;
				break;
			}
			var amount = parseFloat(cartData[i]?.Product?.price) * parseFloat(cartData[i]?.quantity);
			totalAmount += amount || 0;
			const tData = {
				vendorId: cartData[i]?.Product?.userId,
				amount: amount - (amount * commission) / 100,
				stripeAccountId: cartData[i]?.Product?.User?.UserAccount?.stripeAccountId,
			};
			transferData = [...transferData, tData];
		}
		// check availability of product data
		if (outOfStock) {
			return {
				status: 200,
				data: {},
				message: '',
				error: { message: 'Product quantity not available' },
			};
		}

		const token = await stripe.tokens.create({
			card: {
				number: validatedData?.cardNumber,
				exp_month: validatedData?.expiryMonth,
				exp_year: validatedData?.expiryYear,
				cvc: validatedData?.cvv,
			},
		});

		const charge = await stripe.charges.create({
			amount: totalAmount * 100,
			currency: 'usd',
			source: token.id,
			description: 'product purchase',
			transfer_group: ramdomString,
		});

		transferData = transferData.filter((val) => val.vendorId !== undefined);

		for (let i = 0; i < transferData.length; i++) {
			const transfer = await stripe.transfers.create({
				amount: transferData[i]?.amount * 100,
				currency: 'usd',
				destination: transferData[i]?.stripeAccountId,
				transfer_group: ramdomString,
			});
		}
		const orderInsertedData = {
			customerId: user.id,
			totalAmount: totalAmount,
			shippingCharge: 0,
			status: charge?.status === 'succeeded' ? 'COMPLETED' : 'PENDING',
		};

		const orderData = await Order.create(orderInsertedData);
		let orderProductInsertedData = [];

		for (let i = 0; i < cartData.length; i++) {
			if (cartData[i]?.productId) {
				var amount = parseFloat(cartData[i]?.Product?.price) * parseFloat(cartData[i]?.quantity);
				const productData = {
					orderId: orderData.id,
					productId: cartData[i]?.productId,
					price: cartData[i]?.Product?.price,
					quantity: cartData[i]?.quantity,
					total: amount,
				};
				orderProductInsertedData = [...orderProductInsertedData, productData];

				// stock minus from product
				const productDta = await Product.findOne({ where: { id: cartData[i]?.productId } });
				const updatedStock = productDta.stock - cartData[i]?.quantity;
				await Product.update({ stock: updatedStock }, { where: { id: cartData[i]?.productId } });
			}
		}

		const orderShipInsertedData = {
			orderId: orderData.id,
			name: validatedData.name,
			email: validatedData.email,
			phone: validatedData.phone,
			address1: validatedData.address1,
			address2: validatedData.address2,
			country: validatedData.country,
			state: validatedData.state,
			city: validatedData.city,
			zipCode: validatedData.postCode,
			notes: validatedData.comment,
		};

		const orderPaymentInsertedData = {
			orderId: orderData.id,
			transactionId: charge.id,
			status: charge?.status === 'succeeded' ? 'SUCCESS' : 'PENDING',
		};
		await OrderProduct.bulkCreate(orderProductInsertedData);
		await OrderShipping.create(orderShipInsertedData);
		await OrderPayment.create(orderPaymentInsertedData);
		await Cart.destroy({
			where: {
				userId: user.id,
			},
		});

		return {
			status: 200,
			data: orderData,
			message: 'Order placed successfully !',
			error: {},
		};
	} catch (e) {
		return { status: 500, data: [], error: { message: 'Something went wrong !', reason: e.message, stack: e.stack } };
	}
};
