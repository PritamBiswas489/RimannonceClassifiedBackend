import db from '../databases/models/index.js';
import '../config/environment.js';
import { default as api } from '../config/apiConfig.js';

const { User, Op } = db;
import { editProfileValidator } from '../validators/profile.validator.js';

export const getProfileDetails = async (request) => {
	try {
		const { payload, user } = request;
		const userDetails = await User.findOne({ where: { id: user.id }, attributes: [
			'name', 
			'userName', 
			'email', 
			'avatar', 
			'about',
		    'fbLink',
			'twLink',
			'instaLink',
			'artistType',
			'banner'
		
		] });
		return {
			status: 200,
			data: userDetails,
			message: '',
			error: {},
		};
	} catch (e) {
		return { status: 500, data: [], error: { message: 'Something went wrong !', reason: e.message } };
	}
};

export const editProfile = async (request) => {
	try {
		const { payload, user } = request;
		const rawData = {
			profileImg: payload.profileImg,
			userName: payload.userName,
			name: payload.name,
		};
		const [err, validatedData] = await editProfileValidator(rawData, user.id);
		if (err) {
			return err;
		}
		const formData = {
			profileImg: validatedData.profileImg,
		};
		const result = await api.post('/api/upload-file', formData);
		if (result.data.status === 200) {

			
			const data = result.data.data;
			const updatedData = {
				userName: validatedData.userName,
				name: validatedData.name,
				about: payload.about,
				fbLink: payload.fbLink,
				twLink: payload.twLink,
				instaLink: payload.instaLink,
				artistType: payload.artistType,
				avatar: data.profileImg,

			};
			if(payload?.bannerImage && payload?.bannerImage!==''){
				const result = await api.post('/api/upload-file', {
					attachment: payload?.bannerImage,
				});
				if(result?.data?.data?.attachment){
					updatedData.banner = result?.data?.data?.attachment;
				}
			}
			await User.update(updatedData, {
				where: {
					id: user.id,
				},
			});
			return {
				status: 200,
				data: [],
				message: 'Profile updated successfully !',
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
