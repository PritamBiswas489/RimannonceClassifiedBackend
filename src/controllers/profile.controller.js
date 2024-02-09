import db from '../databases/models/index.js';
import '../config/environment.js';
import { default as api } from '../config/apiConfig.js';
import { hashStr, compareHashedStr, generateToken } from '../libraries/auth.js';

const { User, Op, Announcement, AnnouncementMedia , Favorites, ContactUs} = db;
import { editProfileValidator } from '../validators/profile.validator.js';
import { request } from 'express';
import { deleteExistingAvatar } from '../libraries/utility.js';
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
export const getUserWalletAmount = async (request)=>{
	try {
		const { payload, user } = request;
		const userDetails = await User.findOne({ where: { id: user.id }, attributes: [
			'walletAmount'
		
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

}

export const editProfile = async (request) => {
	try {
		const { payload, user } = request;
		const rawData = {
			phone: payload.phone,
			email: payload.email,
			name: payload.name,
		};
		const [err, validatedData] = await editProfileValidator(rawData, user.id);
		if (err) {
			return err;
		}

		const updatedData = {
			name: validatedData.name,
			email: validatedData.email,
			phone: validatedData.phone,
			language:payload?.language,
			phoneCountryCode:payload.phoneCountryCode,
		};
		let successMessage = 'Profile updated successfully!';
		if(payload?.password!==''){
			updatedData.password = await hashStr(payload?.password);
			successMessage = 'Profile and password updated successfully!';
		}
		await User.update(updatedData, {
			where: {
				id: user.id,
			},
		});
		const userData = await User.findOne({ where: { id: user.id } });

		return {
			status: 200,
			data: {
				user:userData
			},
			message: successMessage,
			error: {},
		};
	} catch (e) {
		return { status: 500, data: [], error: { message: 'Something went wrong !', reason: e.message } };
	}


}
export const editProfileBk = async (request) => {
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
export const contactUs =  async (request) => {
	try {
		const { payload, user } = request;
		const subject = payload?.subject;
		const message = payload?.message;

		const createData = await ContactUs.create({
			userId:user?.id,
			subject,
			message
		});
		return {
			status: 200,
			data: [],
			message: 'Message successfully send !',
			error: {},
		};
	} catch (e) {
		return { status: 500, data: [], error: { message: 'Something went wrong !', reason: e.message } };
	}

}

export const deleteUserAccount =  async (request) => {
	try {
		const { payload, user } = request;
		const userData = await User.findOne({ where: { id: user?.id },
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
        await User.destroy({ where: { id: userData?.id } });
		
		return {
			status: 200,
			data: {delete:1},
			message: 'Your account deleted permanently',
			error: {},
		};

	}catch (e) {
		return { status: 500, data: [], error: { message: 'Something went wrong !', reason: e.message } };
	}




}
