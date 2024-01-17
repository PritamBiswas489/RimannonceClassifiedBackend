import db from '../databases/models/index.js';
import '../config/environment.js';
import { default as api } from '../config/apiConfig.js';

const { Page, Notification } = db;

export const createOrUpdateTheme1 = async (request = {}, type = 'CREATE') => {
	const { payload, user } = request;

	const formData = {
		bannerImg: payload?.bannerImg,
		aboutImg: payload?.aboutImg,
		eventBackgroundImg: payload?.eventBackgroundImg,
		themeThumbnailImage: payload?.themeThumbnailImage,
	};
	const result = await api.post('/api/upload-file', formData);
	if (result.data.status === 200) {
		const data = result.data.data;
		const content = {
			bannerImg: data?.bannerImg,
			bannerTitle: payload?.bannerTitle,
			bannerSubTitle: payload?.bannerSubTitle,
			bannerSpotifyCode: payload?.bannerSpotifyCode,
			aboutSectionIsActive: payload?.aboutSectionIsActive,
			aboutImg: data?.aboutImg,
			aboutTitle: payload?.aboutTitle,
			aboutDescription: payload?.aboutDescription,
			aboutEmailLink: payload?.aboutEmailLink,
			aboutTwitterLink: payload?.aboutTiktokLink,
			aboutInstaLink: payload?.aboutInstaLink,
			aboutTiktokLink: payload?.aboutTiktokLink,
			aboutWebsiteLink: payload?.aboutWebsiteLink,
			aboutFacebookLink: payload?.aboutFacebookLink,
			aboutSpotifyLink: payload?.aboutSpotifyLink,
			aboutShopifyLink: payload?.aboutShopifyLink,
			eventSectionIsActive: payload?.eventSectionIsActive,
			eventBackgroundImg: data?.eventBackgroundImg,
			eventSectionTitle: payload?.eventSectionTitle,
			myEvents: payload?.myEvents,
			videoSectionIsActive: payload?.videoSectionIsActive,
			videoSectionTitle: payload?.videoSectionTitle,
			latestVideo: payload?.latestVideo,
			socialSectionIsActive: payload?.socialSectionIsActive,
			instagramLink: payload?.instagramLink,
			fbLink: payload?.fbLink,
			twitterLink: payload?.twitterLink,
			tiktokLink: payload?.tiktokLink,
			appleMusicLink: payload?.appleMusicLink,
		};

		const sectionOrder = [
			{
				id: 'SECTION-1',
				order: 1,
			},
			{
				id: 'SECTION-2',
				order: 2,
			},
			{
				id: 'SECTION-3',
				order: 3,
			},
			{
				id: 'SECTION-4',
				order: 4,
			},
			{
				id: 'SECTION-5',
				order: 5,
			},
		];
		if (type === 'CREATE') {
			const insertedData = {
				userId: user.id,
				pageTitle: payload?.pageTitle,
				thumbImage: data?.themeThumbnailImage,
				description: payload?.pageDescription,
				content,
				sectionOrder,
				theme: payload?.theme,
			};

			const pageData = await Page.create(insertedData);


			await Notification.create({
				fromId: user.id,
				toId: 1,
				isRead: 0,
				message:
					 

					((payload?.pageTitle && payload.pageTitle!='') ? `Create a new page name: ${payload?.pageTitle} using theme one` : 'Create a new page using theme one'),
			});

			return {
				status: 200,
				data: { pageId: pageData.uuid },
				message: 'Page created successfully',
				error: {},
			};
		} else if (type === 'UPDATE') {
			const updatedData = {
				pageTitle: payload?.pageTitle,
				thumbImage: data?.themeThumbnailImage,
				description: payload?.pageDescription,
				content,
				sectionOrder: payload?.sectionOrder,
			};

			const pageData = await Page.update(updatedData, { where: { uuid: payload?.id } });
			await Notification.create({
				fromId: user.id,
				toId: 1,
				isRead: 0,
				message:
				((payload?.pageTitle && payload.pageTitle!='') ? `Update page name:  ${payload?.pageTitle}` : 'Update page'),
			});
			
			return {
				status: 200,
				data: {},
				message: 'Page updated successfully',
				error: {},
			};
		}
	} else {
		return {
			status: 500,
			data: [],
			error: { message: 'Something went wrong !', reason: result?.data?.error?.message },
		};
	}
};

export const createOrUpdateTheme2 = async (request = {}, type = 'CREATE') => {
	const { payload, user } = request;

	const formData = {
		bannerImg: payload?.bannerImg,
		aboutImg: payload?.aboutImg,
		themeThumbnailImage: payload?.themeThumbnailImage,
	};
	const result = await api.post('/api/upload-file', formData);
	if (result.data.status === 200) {
		const data = result.data.data;
		const content = {
			bannerImg: data?.bannerImg,
			bannerTitle: payload?.bannerTitle,
			bannerSubTitle: payload?.bannerSubTitle,
			bannerDescription: payload?.bannerDescription,
			aboutSectionIsActive: payload?.aboutSectionIsActive,
			aboutImg: data?.aboutImg,
			aboutTitle: payload?.aboutTitle,
			aboutDescription: payload?.aboutDescription,
			aboutEmailLink: payload?.aboutEmailLink,
			aboutTwitterLink: payload?.aboutTiktokLink,
			aboutInstaLink: payload?.aboutInstaLink,
			aboutTiktokLink: payload?.aboutTiktokLink,
			aboutWebsiteLink: payload?.aboutWebsiteLink,
			aboutFacebookLink: payload?.aboutFacebookLink,
			aboutSpotifyLink: payload?.aboutSpotifyLink,
			aboutShopifyLink: payload?.aboutShopifyLink,
			eventSectionIsActive: payload?.eventSectionIsActive,
			eventSectionTitle: payload?.eventSectionTitle,
			myEvents: payload?.myEvents,

			socialSection2IsActive: payload?.socialSection2IsActive,
			twitterLink: payload?.twitterLink,
			spotifyLink: payload?.spotifyLink,

			socialSectionIsActive: payload?.socialSectionIsActive,
			instagramLink: payload?.instagramLink,
			fbLink: payload?.fbLink,
			youtubeLink: payload?.youtubeLink,
			tiktokLink: payload?.tiktokLink,
			appleMusicLink: payload?.appleMusicLink,
		};

		const sectionOrder = [
			{
				id: 'SECTION-1',
				order: 1,
			},
			{
				id: 'SECTION-2',
				order: 2,
			},
			{
				id: 'SECTION-3',
				order: 3,
			},
			{
				id: 'SECTION-4',
				order: 4,
			},
			{
				id: 'SECTION-5',
				order: 5,
			},
		];
		if (type === 'CREATE') {
			const insertedData = {
				userId: user.id,
				pageTitle: payload?.pageTitle,
				thumbImage: data?.themeThumbnailImage,
				description: payload?.pageDescription,
				content,
				sectionOrder,
				theme: payload?.theme,
			};

			const pageData = await Page.create(insertedData);

			await Notification.create({
				fromId: user.id,
				toId: 1,
				isRead: 0,
				message:
					((payload?.pageTitle && payload.pageTitle!='') ? `Create a new page name: ${payload?.pageTitle} using theme two` : 'Create a new page using theme two'),
			});


			return {
				status: 200,
				data: { pageId: pageData.uuid },
				message: 'Page created successfully',
				error: {},
			};
		} else if (type === 'UPDATE') {
			const updatedData = {
				pageTitle: payload?.pageTitle,
				thumbImage: data?.themeThumbnailImage,
				description: payload?.pageDescription,
				content,
				sectionOrder: payload?.sectionOrder,
			};

			const pageData = await Page.update(updatedData, { where: { uuid: payload?.id } });

			await Notification.create({
				fromId: user.id,
				toId: 1,
				isRead: 0,
				message:
				((payload?.pageTitle && payload.pageTitle!='') ? `Update page name:  ${payload?.pageTitle}` : 'Update page'),
			});
			return {
				status: 200,
				data: {},
				message: 'Page updated successfully',
				error: {},
			};
		}
	} else {
		return {
			status: 500,
			data: [],
			error: { message: 'Something went wrong !', reason: result?.data?.error?.message },
		};
	}
};

export const createOrUpdateTheme3 = async (request = {}, type = 'CREATE') => {
	const { payload, user } = request;

	const formData = {
		bannerImg: payload?.bannerImg,
		aboutImg: payload?.aboutImg,
		eventBackgroundImg: payload?.eventBackgroundImg,
		themeThumbnailImage: payload?.themeThumbnailImage,
	};
	const result = await api.post('/api/upload-file', formData);
	if (result.data.status === 200) {
		const data = result.data.data;
		const content = {
			bannerImg: data?.bannerImg,
			bannerTitle: payload?.bannerTitle,
			bannerSubTitle: payload?.bannerSubTitle,
			aboutSectionIsActive: payload?.aboutSectionIsActive,
			aboutImg: data?.aboutImg,
			aboutTitle: payload?.aboutTitle,
			aboutDescription: payload?.aboutDescription,
			aboutEmailLink: payload?.aboutEmailLink,
			aboutTwitterLink: payload?.aboutTiktokLink,
			aboutInstaLink: payload?.aboutInstaLink,
			aboutTiktokLink: payload?.aboutTiktokLink,
			aboutWebsiteLink: payload?.aboutWebsiteLink,
			aboutFacebookLink: payload?.aboutFacebookLink,
			aboutSpotifyLink: payload?.aboutSpotifyLink,
			aboutShopifyLink: payload?.aboutShopifyLink,
			eventSectionIsActive: payload?.eventSectionIsActive,
			eventBackgroundImg: data?.eventBackgroundImg,
			eventSectionTitle: payload?.eventSectionTitle,
			myEvents: payload?.myEvents,
			socialSectionIsActive: payload?.socialSectionIsActive,
			instagramLink: payload?.instagramLink,
			fbLink: payload?.fbLink,
			twitterLink: payload?.twitterLink,
			tiktokLink: payload?.tiktokLink,
			appleMusicLink: payload?.appleMusicLink,
			youtubeLink: payload?.youtubeLink,
			spotifyLink: payload?.spotifyLink,
		};

		const sectionOrder = [
			{
				id: 'SECTION-1',
				order: 1,
			},
			{
				id: 'SECTION-2',
				order: 2,
			},
			{
				id: 'SECTION-3',
				order: 3,
			},
			{
				id: 'SECTION-4',
				order: 4,
			},
			{
				id: 'SECTION-5',
				order: 5,
			},
		];
		if (type === 'CREATE') {
			const insertedData = {
				userId: user.id,
				pageTitle: payload?.pageTitle,
				thumbImage: data?.themeThumbnailImage,
				description: payload?.pageDescription,
				content,
				sectionOrder,
				theme: payload?.theme,
			};

			const pageData = await Page.create(insertedData);

			await Notification.create({
				fromId: user.id,
				toId: 1,
				isRead: 0,
				message:
					((payload?.pageTitle && payload.pageTitle!='') ? `Create a new page name: ${payload?.pageTitle} using theme three` : 'Create a new page using theme three'),
			});

			return {
				status: 200,
				data: { pageId: pageData.uuid },
				message: 'Page created successfully',
				error: {},
			};
		} else if (type === 'UPDATE') {
			const updatedData = {
				pageTitle: payload?.pageTitle,
				thumbImage: data?.themeThumbnailImage,
				description: payload?.pageDescription,
				content,
				sectionOrder: payload?.sectionOrder,
			};

			const pageData = await Page.update(updatedData, { where: { uuid: payload?.id } });

			await Notification.create({
				fromId: user.id,
				toId: 1,
				isRead: 0,
				message:
				((payload?.pageTitle && payload.pageTitle!='') ? `Update page name:  ${payload?.pageTitle}` : 'Update page'),
			});
			return {
				status: 200,
				data: {},
				message: 'Page updated successfully',
				error: {},
			};
		}
	} else {
		return {
			status: 500,
			data: [],
			error: { message: 'Something went wrong !', reason: result?.data?.error?.message },
		};
	}
};

export const createOrUpdateTheme4 = async (request = {}, type = 'CREATE') => {
	const { payload, user } = request;

	const formData = {
		bannerImg: payload?.bannerImg,
		eventBackgroundImg: payload?.eventBackgroundImg,
		themeThumbnailImage: payload?.themeThumbnailImage,
	};
	const result = await api.post('/api/upload-file', formData);
	if (result.data.status === 200) {
		const data = result.data.data;
		const content = {
			bannerImg: data?.bannerImg,
			bannerTitle: payload?.bannerTitle,
			bannerSubTitle: payload?.bannerSubTitle,
			aboutSectionIsActive: payload?.aboutSectionIsActive,
			aboutTitle: payload?.aboutTitle,
			aboutDescription: payload?.aboutDescription,
			aboutEmailLink: payload?.aboutEmailLink,
			aboutTwitterLink: payload?.aboutTiktokLink,
			aboutInstaLink: payload?.aboutInstaLink,
			aboutTiktokLink: payload?.aboutTiktokLink,
			aboutWebsiteLink: payload?.aboutWebsiteLink,
			aboutFacebookLink: payload?.aboutFacebookLink,
			aboutSpotifyLink: payload?.aboutSpotifyLink,
			aboutShopifyLink: payload?.aboutShopifyLink,
			eventSectionIsActive: payload?.eventSectionIsActive,
			eventBackgroundImg: data?.eventBackgroundImg,
			eventSectionTitle: payload?.eventSectionTitle,
			myEvents: payload?.myEvents,
			socialSectionIsActive: payload?.socialSectionIsActive,
			instagramLink: payload?.instagramLink,
			fbLink: payload?.fbLink,
			twitterLink: payload?.twitterLink,
			tiktokLink: payload?.tiktokLink,
			appleMusicLink: payload?.appleMusicLink,
			youtubeLink: payload?.youtubeLink,
			spotifyLink: payload?.spotifyLink,
		};

		const sectionOrder = [
			{
				id: 'SECTION-1',
				order: 1,
			},
			{
				id: 'SECTION-2',
				order: 2,
			},
			{
				id: 'SECTION-3',
				order: 3,
			},
			{
				id: 'SECTION-4',
				order: 4,
			},
			{
				id: 'SECTION-5',
				order: 5,
			},
		];
		if (type === 'CREATE') {
			const insertedData = {
				userId: user.id,
				pageTitle: payload?.pageTitle,
				thumbImage: data?.themeThumbnailImage,
				description: payload?.pageDescription,
				content,
				sectionOrder,
				theme: payload?.theme,
			};

			const pageData = await Page.create(insertedData);

			await Notification.create({
				fromId: user.id,
				toId: 1,
				isRead: 0,
				message:
					((payload?.pageTitle && payload.pageTitle!='') ? `Create a new page name: ${payload?.pageTitle} using theme four` : 'Create a new page using theme four'),
			});

			return {
				status: 200,
				data: { pageId: pageData.uuid },
				message: 'Page created successfully',
				error: {},
			};
		} else if (type === 'UPDATE') {
			const updatedData = {
				pageTitle: payload?.pageTitle,
				thumbImage: data?.themeThumbnailImage,
				description: payload?.pageDescription,
				content,
				sectionOrder: payload?.sectionOrder,
			};

			const pageData = await Page.update(updatedData, { where: { uuid: payload?.id } });
			await Notification.create({
				fromId: user.id,
				toId: 1,
				isRead: 0,
				message:
				((payload?.pageTitle && payload.pageTitle!='') ? `Update page name:  ${payload?.pageTitle}` : 'Update page'),
			});
			return {
				status: 200,
				data: {},
				message: 'Page updated successfully',
				error: {},
			};
		}
	} else {
		return {
			status: 500,
			data: [],
			error: { message: 'Something went wrong !', reason: result?.data?.error?.message },
		};
	}
};
