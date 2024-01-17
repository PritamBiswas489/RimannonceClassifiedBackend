import db from '../databases/models/index.js';
import { createBlogValidator, editBlogValidator } from '../validators/blog.validator.js';
import { default as api } from '../config/apiConfig.js';

const { Drop, Nft, Product, Blog, Comment, Op, Notification } = db;

export const createBlog = async (request) => {
	try {
		const { payload, user } = request;
		const rawData = {
			title: payload.title,
			attachment: payload.attachment,
			attachmentType: payload.attachmentType,
			description: payload.description,
		};
		const [err, validatedData] = await createBlogValidator(rawData);
		if (err) {
			return err;
		}
		const formData = {
			attachment: validatedData?.attachment,
		};
		const result = await api.post('/api/upload-file', formData);
		if (result.data.status === 200) {
			const data = result.data.data;
			const insertedData = {
				title: validatedData.title,
				attachment: data.attachment,
				attachmentType: validatedData.attachmentType,
				description: validatedData.description,
				createdBy: user.id,
			};
			const blogData = await Blog.create(insertedData);

			await Notification.create({
				fromId: user.id,
				toId: 1,
				isRead: 0,
				message: `Added new blog ${validatedData?.title}`	 
			});

			return {
				status: 200,
				data: {},
				message: 'Blog created successfully',
				error: {},
			};
		} else {
			return {
				status: 500,
				data: [],
				error: { message: 'Something went wrong !', reason: result?.data?.error?.message },
			};
		}
	} catch (e) {
		return { status: 500, data: [], error: { message: 'Something went wrong !', reason: e.message } };
	}
};

export const listBlog = async (request) => {
	try {
		const { payload, user } = request;

		const limit = 15;
		const page = payload?.page || 1;
		const offset = (page - 1) * limit;

		const { count, rows } = await Blog.findAndCountAll({
			where: { createdBy: user.id },
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

export const editBlog = async (request) => {
	try {
		const { payload, user } = request;
		const rawData = {
			title: payload.title,
			attachment: payload.attachment,
			attachmentType: payload.attachmentType,
			description: payload.description,
		};
		const [err, validatedData] = await editBlogValidator(rawData);
		if (err) {
			return err;
		}
		const formData = {
			attachment: validatedData?.attachment,
		};
		const result = await api.post('/api/upload-file', formData);
		if (result.data.status === 200) {
			const data = result.data.data;
			const updatedData = {
				title: validatedData.title,
				attachment: data.attachment,
				attachmentType: validatedData.attachmentType,
				description: validatedData.description,
			};
			const blogData = await Blog.update(updatedData, { where: { id: payload.id } });
			return {
				status: 200,
				data: {},
				message: 'Blog created successfully',
				error: {},
			};
		} else {
			return {
				status: 500,
				data: [],
				error: { message: 'Something went wrong !', reason: result?.data?.error?.message },
			};
		}
	} catch (e) {
		return { status: 500, data: [], error: { message: 'Something went wrong !', reason: e.message } };
	}
};

export const details = async (request) => {
	try {
		const { payload, user } = request;

		const blogDetails = await Blog.findOne({ where: { id: payload.id } });

		return {
			status: 200,
			data: blogDetails,
			message: 'Records fetched',
			error: {},
		};
	} catch (e) {
		return { status: 500, data: [], error: { message: 'Something went wrong !', reason: e.message } };
	}
};

export const destroy = async (request) => {
	try {
		const { payload, user } = request;

		const blogDetails = await Blog.destroy({ where: { id: payload.id } });

		return {
			status: 200,
			data: blogDetails,
			message: 'Record deleted successfully !',
			error: {},
		};
	} catch (e) {
		return { status: 500, data: [], error: { message: 'Something went wrong !', reason: e.message } };
	}
};

export const commenting = async (request) => {
	try {
		const { payload, user } = request;

		// const blogDetails = await Blog.destroy({ where: { id: payload.id } });


		const blogDetails = await Blog.findOne({ where: { id: payload.blogId } });

		
		const insertedData = {
			blogId: payload.blogId,
			commentBy: user.id,
			comment: payload.comment,
		};
		const commentData = await Comment.create(insertedData);

		await Notification.create({
			fromId: user.id,
			toId: blogDetails?.createdBy,
			isRead: 0,
			message: `Made a comment on your post  ${blogDetails?.title}`	 
		});
		return {
			status: 200,
			data: {},
			message: 'Record inserted successfully !',
			error: {},
		};
	} catch (e) {
		return { status: 500, data: [], error: { message: 'Something went wrong !', reason: e.message } };
	}
};

export const deleteComment = async (request) => {
	try {
		const { payload, user } = request;

		const commentData = await Comment.destroy({ where: { id: payload.id } });
		return {
			status: 200,
			data: {},
			message: 'Comment deleted successfully !',
			error: {},
		};
	} catch (e) {
		return { status: 500, data: [], error: { message: 'Something went wrong !', reason: e.message } };
	}
};
