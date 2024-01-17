import db from '../databases/models/index.js';
import '../config/environment.js';
import { default as api } from '../config/apiConfig.js';
import { slugify } from '../libraries/utility.js';

const { User, Op, Content, PortFolio, Service, Testimonial, ContactUs, Blog, Industry } = db;

export const addHomeContent = async (request) => {
	try {
		const { payload } = request;
		let formData = {
			// reviewLogo: payload?.reviewLogo,
			// reviewerImg: payload?.reviewerImg,
			vdoFile: payload?.vdoFile,
			vdoPlaceholder: payload?.vdoPlaceholder,
			bannerImg: payload?.bannerImg,
			mobileBannerImg: payload?.mobileBannerImg,
			// portFolioImg1: payload?.portFolioImg1,
			// portFolioImg2: payload?.portFolioImg2,
			// portFolioClientLogo: payload?.portFolioClientLogo,
		};
		const result = await api.post('/api/upload-file', formData);
		if (result.data.status === 200) {
			const data = result.data.data;

			const bannerData = {
				title: payload?.bannerTitle,
				description: payload?.bannerDescription,
				img: data.bannerImg,
				mobileImg: data.mobileBannerImg,
			};
			const VdoSectionData = {
				video: data?.vdoFile,
				vdoPlaceholder: data?.vdoPlaceholder,
				description: payload?.vdo_section_desc,
			};

			// const portFolioData = payload?.portFolio?.map((val, i) => {
			// 	return {
			// 		img1: data?.portFolioImg1[i],
			// 		img2: data?.portFolioImg2[i],
			// 		clientLogo: data?.portFolioClientLogo[i],
			// 		backGroundText: val?.backGroundText,
			// 		title: val?.title,
			// 		link: val?.link,
			// 		color: val?.color,
			// 		description: val?.description,
			// 	};
			// });

			const serviceData = {
				title: payload?.serviceTitle,
				description: payload?.serviceDescription,
				letftItem: {
					title1: payload?.service1Title,
					description1: payload?.service1Description,
					title2: payload?.service2Title,
					description2: payload?.service2Description,
					title3: payload?.service3Title,
					description3: payload?.service3Description,
				},
				rightItem: {
					title4: payload?.service4Title,
					description4: payload?.service4Description,
					title5: payload?.service5Title,
					description5: payload?.service5Description,
					title6: payload?.service6Title,
					description6: payload?.service6Description,
				},
			};

			// const reviewData = payload?.reviews?.map((val, i) => {
			// 	return {
			// 		reviewerName: val?.reviewerName,
			// 		reviewerDesig: val?.reviewerDesig,
			// 		reviewerImg: data?.reviewerImg[i],
			// 		logo: data?.reviewLogo[i],
			// 		reviewContent: val?.reviewContent,
			// 		link: val?.link,
			// 	};
			// });

			const content = {
				banner: bannerData,
				VdoSection: VdoSectionData,
				service: serviceData,
				// review: reviewData,
				// portFolio: portFolioData,
			};
			const checkContent = await Content.findOne({ where: { page: 1 } });
			if (checkContent) {
				await Content.update(
					{ content: content },
					{
						where: {
							page: 1,
						},
					}
				);
			} else {
				await Content.create({
					page: 1,
					content: content,
				});
			}

			return {
				status: 200,
				data: [],
				message: 'Content saved successfully',
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

export const addHowWeWorkContent = async (request) => {
	try {
		const { payload } = request;
		let formData = {
			stepImg: payload?.stepImg,
			bannerImg: payload?.bannerImg,
		};
		// console.log('formData', formData);
		const result = await api.post('/api/upload-file', formData);
		// console.log('result', result.data);
		if (result.data.status === 200) {
			const data = result.data.data;

			const bannerData = {
				title: payload?.bannerTitle,
				description: payload?.bannerDescription,
				img: data.bannerImg,
				link: payload?.bannerLink,
			};

			const stepData = payload?.steps?.map((val, i) => {
				return {
					title: val?.title,
					description: val?.description,
					img: data.stepImg?.[i],
					link: val.link,
				};
			});

			const content = {
				banner: bannerData,
				steps: stepData,
			};
			const checkContent = await Content.findOne({ where: { page: 3 } });
			if (checkContent) {
				await Content.update(
					{ content: content },
					{
						where: {
							page: 3,
						},
					}
				);
			} else {
				await Content.create({
					page: 3,
					content: content,
				});
			}

			return {
				status: 200,
				data: [],
				message: 'Content saved successfully',
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

export const addCareerContent = async (request) => {
	try {
		const { payload } = request;
		let formData = {
			comeOnBoardImg: payload?.comeOnBoardImg,
			bannerImg: payload?.bannerImg,
			section3Img: payload?.section3Img,
			section4Img: payload?.section4Img,
			section5Img: payload?.section5Img,
		};
		const result = await api.post('/api/upload-file', formData);
		if (result.data.status === 200) {
			const data = result.data.data;

			const bannerData = {
				title: payload?.bannerTitle,
				description: payload?.bannerDescription,
				img: data.bannerImg,
			};

			const comeOnBoardData = payload?.comeOnBoard?.map((val, i) => {
				return {
					title: val?.boardTitle,
					hiring: val?.boardHiring,
					img: data.comeOnBoardImg?.[i],
				};
			});

			const section3data = {
				title: payload?.section3Title,
				img: data.section3Img,
			};

			const section4data = {
				title: payload?.section4Title,
				description: payload?.section4Description,
				img: data.section4Img,
			};

			const section5data = {
				title: payload?.section5Title,
				description: payload?.section5Description,
				img: data.section5Img,
			};

			const section6data = {
				title: payload?.section6Title,
				description: payload?.section6Description,
			};

			const content = {
				banner: bannerData,
				comeOnBoard: comeOnBoardData,
				section3: section3data,
				section4: section4data,
				section5: section5data,
				section6: section6data,
			};
			const checkContent = await Content.findOne({ where: { page: 4 } });
			if (checkContent) {
				await Content.update(
					{ content: content },
					{
						where: {
							page: 4,
						},
					}
				);
			} else {
				await Content.create({
					page: 4,
					content: content,
				});
			}

			return {
				status: 200,
				data: [],
				message: 'Content saved successfully',
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

export const addAboutContent = async (request) => {
	try {
		const { payload } = request;
		let formData = {
			ourValueImg: payload?.ourValueImg,
			ourValueItemImg: payload?.ourValueItemImg,
			storyImg: payload?.storyImg,
			weTalkImg: payload?.weTalkImg,
			bannerImg: payload?.bannerImg,
		};
		const result = await api.post('/api/upload-file', formData);
		if (result.data.status === 200) {
			const data = result.data.data;

			const bannerData = {
				title: payload?.bannerTitle,
				description: payload?.bannerDescription,
				img: data.bannerImg,
				link: payload?.bannerLink,
			};
			const storyData = {
				title: payload?.storyTitle,
				heading: payload?.storyHeading,
				description: payload?.storyDescription,
				img: data?.storyImg,
			};
			const ourValueData = {
				title: payload?.coreValueTitle,
				img: data?.ourValueImg,
			};
			console.log(data?.storyImg);
			const ourValueItemData = payload?.ourValueItem.map((val, i) => {
				return {
					title: val?.title,
					description: val?.description,
					img: data?.ourValueItemImg?.[i],
				};
			});

			const weTalkData = {
				ceoName: payload?.weSayCeoName,
				description: payload?.weSayDescription,
				img: data?.weTalkImg,
			};

			const content = {
				banner: bannerData,
				story: storyData,
				ourValue: ourValueData,
				ourValueItem: ourValueItemData,
				weTalk: weTalkData,
			};

			const checkContent = await Content.findOne({ where: { page: 2 } });
			if (checkContent) {
				await Content.update(
					{ content: content },
					{
						where: {
							page: 2,
						},
					}
				);
			} else {
				await Content.create({
					page: 2,
					content: content,
				});
			}

			return {
				status: 200,
				data: [],
				message: 'Content saved successfully',
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

export const addPortfolioContent = async (request) => {
	try {
		const { payload } = request;

		const formData = {
			bannerImg: payload?.bannerImg,
			backgroundImg: payload?.backgroundImg,
			displayImg: payload?.displayImg,
			clientAvatar: payload?.clientAvatar,
			clientLogo: payload?.clientLogo,
			logo: payload?.logo,
			problemGallery: payload?.problemGallery,
			technologyImg: payload?.technologyImg,
			weDidGallery: payload?.weDidGallery,
			homeImg1: payload?.homeImg1,
			homeImg2: payload?.homeImg2,
		};

		const result = await api.post('/api/upload-file', formData);

		if (result.data.status === 200) {
			const data = result.data.data;

			const mainSectionData = {
				bannerImg: data.bannerImg,
				backgroundImg: data.backgroundImg,
				title: payload?.title,
				description: payload?.description,
				technologyImg: data.technologyImg,
				clientLogo: data.clientLogo,
				displayImg: data.displayImg,
			};
			const aboutClientData = {
				heading: payload?.clientHeading,
				description: payload?.clientDescription,
			};

			const problemSectionData = {
				heading: payload?.problemHeading,
				description: payload?.problemDescription,
				gallery: data?.problemGallery,
			};

			const whatWeDidData = {
				heading: payload?.weDidHeading,
				description: payload?.weDidDescription,
				item: payload?.weDidItem,
				gallery: data?.weDidGallery,
			};

			const clientSayData = {
				avatar: data?.clientAvatar,
				logo: data?.logo,
				heading: payload?.clientSayHeading,
				description: payload?.clientSayDescription,
				clientName: payload?.clientName,
				clientDesignation: payload?.clientDesignation,
			};

			const homeSectionData = {
				img1: data?.homeImg1,
				img2: data?.homeImg2,
				backgroundText: payload?.homeBackgroundText,
				color: payload?.homeColor,
			};

			const content = {
				mainSection: mainSectionData,
				aboutClient: aboutClientData,
				problemSection: problemSectionData,
				whatWeDid: whatWeDidData,
				clientSay: clientSayData,
				homeSection: homeSectionData,
			};

			const slug = await slugify(payload?.title);

			const portFolio = PortFolio.create({
				content,
				slug,
			});

			return {
				status: 200,
				data: [],
				message: 'Content saved successfully',
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

export const listPortfolio = async (request) => {
	try {
		const { payload } = request;

		const limit = 15;
		const page = payload?.page || 1;
		const offset = (page - 1) * limit;

		const { count, rows } = await PortFolio.findAndCountAll({
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

export const editPortfolioContent = async (request) => {
	try {
		const { payload } = request;

		const formData = {
			bannerImg: payload?.bannerImg,
			backgroundImg: payload?.backgroundImg,
			displayImg: payload?.displayImg,
			clientAvatar: payload?.clientAvatar,
			clientLogo: payload?.clientLogo,
			logo: payload?.logo,
			problemGallery: payload?.problemGallery,
			technologyImg: payload?.technologyImg,
			weDidGallery: payload?.weDidGallery,
			homeImg1: payload?.homeImg1,
			homeImg2: payload?.homeImg2,
		};

		const result = await api.post('/api/upload-file', formData);

		if (result.data.status === 200) {
			const data = result.data.data;

			const mainSectionData = {
				bannerImg: data.bannerImg,
				backgroundImg: data.backgroundImg,
				title: payload?.title,
				description: payload?.description,
				technologyImg: data.technologyImg,
				clientLogo: data.clientLogo,
				displayImg: data.displayImg,
			};
			const aboutClientData = {
				heading: payload?.clientHeading,
				description: payload?.clientDescription,
			};

			const problemSectionData = {
				heading: payload?.problemHeading,
				description: payload?.problemDescription,
				gallery: data?.problemGallery,
			};

			const whatWeDidData = {
				heading: payload?.weDidHeading,
				description: payload?.weDidDescription,
				item: payload?.weDidItem,
				gallery: data?.weDidGallery,
			};

			const clientSayData = {
				avatar: data?.clientAvatar,
				logo: data?.logo,
				heading: payload?.clientSayHeading,
				description: payload?.clientSayDescription,
				clientName: payload?.clientName,
				clientDesignation: payload?.clientDesignation,
			};

			const homeSectionData = {
				img1: data?.homeImg1,
				img2: data?.homeImg2,
				backgroundText: payload?.homeBackgroundText,
				color: payload?.homeColor,
			};

			const content = {
				mainSection: mainSectionData,
				aboutClient: aboutClientData,
				problemSection: problemSectionData,
				whatWeDid: whatWeDidData,
				clientSay: clientSayData,
				homeSection: homeSectionData,
			};

			const slug = await slugify(payload?.title);

			const portFolio = PortFolio.update(
				{
					content: content,
					slug,
				},
				{
					where: {
						id: payload?.id,
					},
				}
			);

			return {
				status: 200,
				data: [],
				message: 'Content saved successfully',
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

export const portfolioDetails = async (request) => {
	try {
		const {
			payload: { id },
		} = request;

		const portfolio = await PortFolio.findOne({ where: { id: id } });
		const data = {
			portfolio,
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

export const addService = async (request) => {
	try {
		const { payload } = request;

		const formData = {
			// section1Img: payload?.section1Img,
			section2Img: payload?.section2Img,
			section3Img: payload?.section3Img,
			section4Img: payload?.section4Img,
			section6Img: payload?.section6Img,
			bannerImg: payload?.bannerImg,
			iconImg: payload?.iconImg,
		};

		const result = await api.post('/api/upload-file', formData);

		if (result.data.status === 200) {
			const data = result.data.data;

			const bannerData = {
				img: data?.bannerImg,
				heading: payload?.bannerHeading,
				description: payload?.bannerDescription,
				boxTitle: payload?.bannerTitle,
				status: payload?.bannerStatus,
			};
			const section1Data = {
				heading: payload?.section1heading,
				description: payload?.section1Description,
				status: payload?.section1Status,
			};
			const section2Data = {
				img: data?.section2Img,
				heading: payload?.section2heading,
				description: payload?.section2Description,
				status: payload?.section2Status,
			};
			const section3Data = {
				img: data?.section3Img,
				heading: payload?.section3heading,
				description: payload?.section3Description,
				status: payload?.section3Status,
			};

			const section4Item = payload?.section4Item?.map((val, i) => {
				return {
					title: val?.title,
					img: data?.section4Img[i],
				};
			});
			const section4Data = {
				heading: payload?.section4heading,
				status: payload?.section4Status,
				item: section4Item,
			};

			const section5Item = payload?.section5Item?.map((val, i) => {
				return {
					title: val?.title,
					description: val?.description,
				};
			});
			const section5Data = {
				heading: payload?.section5heading,
				description: payload?.section5Description,
				status: payload?.section5Status,
				item: section5Item,
			};

			const faq = payload?.faq?.map((val, i) => {
				return {
					question: val?.question,
					answer: val?.answer,
				};
			});
			const section6Data = {
				img: data?.section6Img,
				heading: payload?.section6heading,
				description: payload?.section6Description,
				status: payload?.section6Status,
				faq: faq,
			};

			const content = {
				banner: bannerData,
				section1: section1Data,
				section2: section2Data,
				section3: section3Data,
				section4: section4Data,
				section5: section5Data,
				section6: section6Data,
			};

			const slug = await slugify(payload?.serviceName);

			const service = Service.create({
				content,
				slug,
				serviceName: payload?.serviceName,
				logo: data?.iconImg,
				ShortDesc: payload?.infoShortDesc,
			});

			return {
				status: 200,
				data: [],
				message: 'Content saved successfully',
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

export const listService = async (request) => {
	try {
		const { payload } = request;

		const limit = 15;
		const page = payload?.page || 1;
		const offset = (page - 1) * limit;

		const { count, rows } = await Service.findAndCountAll({
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

export const editService = async (request) => {
	try {
		const { payload } = request;

		const formData = {
			// section1Img: payload?.section1Img,
			section2Img: payload?.section2Img,
			section3Img: payload?.section3Img,
			section4Img: payload?.section4Img,
			section6Img: payload?.section6Img,
			bannerImg: payload?.bannerImg,
			iconImg: payload?.iconImg,
		};

		const result = await api.post('/api/upload-file', formData);

		if (result.data.status === 200) {
			const data = result.data.data;

			const bannerData = {
				img: data?.bannerImg,
				heading: payload?.bannerHeading,
				description: payload?.bannerDescription,
				boxTitle: payload?.bannerTitle,
				status: payload?.bannerStatus,
			};
			const section1Data = {
				heading: payload?.section1heading,
				description: payload?.section1Description,
				status: payload?.section1Status,
			};
			const section2Data = {
				img: data?.section2Img,
				heading: payload?.section2heading,
				description: payload?.section2Description,
				status: payload?.section2Status,
			};
			const section3Data = {
				img: data?.section3Img,
				heading: payload?.section3heading,
				description: payload?.section3Description,
				status: payload?.section3Status,
			};

			const section4Item = payload?.section4Item?.map((val, i) => {
				return {
					title: val?.title,
					img: data?.section4Img[i],
				};
			});
			const section4Data = {
				heading: payload?.section4heading,
				status: payload?.section4Status,
				item: section4Item,
			};

			const section5Item = payload?.section5Item?.map((val, i) => {
				return {
					title: val?.title,
					description: val?.description,
				};
			});
			const section5Data = {
				heading: payload?.section5heading,
				description: payload?.section5Description,
				status: payload?.section5Status,
				item: section5Item,
			};

			const faq = payload?.faq?.map((val, i) => {
				return {
					question: val?.question,
					answer: val?.answer,
				};
			});
			const section6Data = {
				img: data?.section6Img,
				heading: payload?.section6heading,
				description: payload?.section6Description,
				status: payload?.section6Status,
				faq: faq,
			};

			const content = {
				banner: bannerData,
				section1: section1Data,
				section2: section2Data,
				section3: section3Data,
				section4: section4Data,
				section5: section5Data,
				section6: section6Data,
			};

			const slug = await slugify(payload?.serviceName);

			const service = Service.update(
				{
					content,
					slug,
					serviceName: payload?.serviceName,
					logo: data?.iconImg,
					ShortDesc: payload?.infoShortDesc,
				},
				{
					where: {
						id: payload?.id,
					},
				}
			);

			return {
				status: 200,
				data: [],
				message: 'Content saved successfully',
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

export const serviceDetails = async (request) => {
	try {
		const {
			payload: { id },
		} = request;

		const service = await Service.findOne({ where: { id: id } });
		const data = {
			service,
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

export const addTestimonial = async (request) => {
	try {
		const { payload } = request;

		const formData = {
			logo: payload?.logo,
			avatar: payload?.avatar,
		};

		const result = await api.post('/api/upload-file', formData);

		if (result.data.status === 200) {
			const data = result.data.data;
			const testimonial = Testimonial.create({
				avatar: data?.avatar,
				logo: data?.logo,
				description: payload?.description,
				clientName: payload?.clientName,
				clientDesignation: payload?.clientDesignation,
				projectLink: payload?.projectLink,
				showInHome: payload?.showInHome ? 1 : 0,
			});

			return {
				status: 200,
				data: [],
				message: 'Content saved successfully',
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

export const listTestimonial = async (request) => {
	try {
		const { payload } = request;

		const limit = 15;
		const page = payload?.page || 1;
		const offset = (page - 1) * limit;

		const { count, rows } = await Testimonial.findAndCountAll({
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

export const editTestimonial = async (request) => {
	try {
		const { payload } = request;

		const formData = {
			logo: payload?.logo,
			avatar: payload?.avatar,
		};

		const result = await api.post('/api/upload-file', formData);

		if (result.data.status === 200) {
			const data = result.data.data;
			const testimonial = Testimonial.update(
				{
					avatar: data?.avatar,
					logo: data?.logo,
					description: payload?.description,
					clientName: payload?.clientName,
					clientDesignation: payload?.clientDesignation,
					projectLink: payload?.projectLink,
					showInHome: payload?.showInHome ? 1 : 0,
				},
				{
					where: {
						id: payload?.id,
					},
				}
			);

			return {
				status: 200,
				data: [],
				message: 'Content saved successfully',
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

export const testimonialDetails = async (request) => {
	try {
		const {
			payload: { id },
		} = request;

		const testimonial = await Testimonial.findOne({ where: { id: id } });
		const data = {
			testimonial,
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

export const listContactUs = async (request) => {
	try {
		const { payload } = request;

		const limit = 15;
		const page = payload?.page || 1;
		const offset = (page - 1) * limit;

		const { count, rows } = await ContactUs.findAndCountAll({
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

export const addBlog = async (request) => {
	try {
		const { payload, user } = request;

		const formData = {
			img: payload?.img,
		};

		const result = await api.post('/api/upload-file', formData);

		if (result.data.status === 200) {
			const data = result.data.data;

			const slug = await slugify(payload?.title);

			const blog = Blog.create({
				title: payload?.title,
				description: payload?.description,
				img: data?.img,
				createdBy: user?.id,
				slug,
			});
			await Notification.create({
				fromId: user.id,
				toId: 1,
				isRead: 0,
				message: `Added new content ${payload?.title}`	 
			});

			return {
				status: 200,
				data: [],
				message: 'Content saved successfully',
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
		const { payload } = request;

		const limit = 15;
		const page = payload?.page || 1;
		const offset = (page - 1) * limit;

		const { count, rows } = await Blog.findAndCountAll({
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

		const formData = {
			img: payload?.img,
		};

		const result = await api.post('/api/upload-file', formData);

		if (result.data.status === 200) {
			const data = result.data.data;
			const slug = await slugify(payload?.title);

			const blog = Blog.update(
				{
					title: payload?.title,
					description: payload?.description,
					img: data?.img,
					slug,
				},
				{
					where: {
						id: payload?.id,
					},
				}
			);

			return {
				status: 200,
				data: [],
				message: 'Content saved successfully',
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

export const blogDetails = async (request) => {
	try {
		const {
			payload: { id },
		} = request;

		const blog = await Blog.findOne({ where: { id: id } });
		const data = {
			blog,
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

export const addPortfolioBannerContent = async (request) => {
	try {
		const { payload } = request;
		let formData = {
			bannerImg: payload?.bannerImg,
			backgroundImg: payload?.backgroundImg,
		};
		const result = await api.post('/api/upload-file', formData);
		if (result.data.status === 200) {
			const data = result.data.data;

			const bannerData = {
				title: payload?.bannerTitle,
				description: payload?.bannerDescription,
				img: data.bannerImg,
				backgroundImg: data?.backgroundImg,
			};

			const content = {
				banner: bannerData,
			};

			const checkContent = await Content.findOne({ where: { page: 5 } });
			if (checkContent) {
				await Content.update(
					{ content: content },
					{
						where: {
							page: 5,
						},
					}
				);
			} else {
				await Content.create({
					page: 5,
					content: content,
				});
			}

			return {
				status: 200,
				data: [],
				message: 'Content saved successfully',
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

export const addSetings = async (request) => {
	try {
		const { payload } = request;

		const content = {
			emailId: payload?.emailId,
			facebookId: payload?.facebookId,
			linkedinId: payload?.linkedinId,
			phone: payload?.phone,
			skypeId: payload?.skypeId,
			twitterId: payload?.twitterId,
			wpNo: payload?.wpNo,
		};
		const checkContent = await Content.findOne({ where: { page: 6 } });

		if (checkContent) {
			await Content.update(
				{ content: content },
				{
					where: {
						page: 6,
					},
				}
			);
		} else {
			await Content.create({
				page: 6,
				content: content,
			});
		}

		return {
			status: 200,
			data: [],
			message: 'Content saved successfully',
			error: {},
		};
	} catch (e) {
		return { status: 500, data: [], error: { message: 'Something went wrong !', reason: e.message } };
	}
};

export const addIndustry = async (request) => {
	try {
		const { payload } = request;

		const formData = {
			section2Img: payload?.section2Img,
			bannerImg: payload?.bannerImg,
			bannerDisplayImg: payload?.bannerDisplayImg,
			iconImg: payload?.iconImg,
		};

		const result = await api.post('/api/upload-file', formData);

		if (result.data.status === 200) {
			const data = result.data.data;

			const bannerData = {
				img: data?.bannerImg,
				bannerDisplayImg: data?.bannerDisplayImg,

				heading: payload?.bannerHeading,
				description: payload?.bannerDescription,
			};
			const section1Data = {
				heading: payload?.section1heading,
				description: payload?.section1Description,
			};

			const section2Item = payload?.section2Item?.map((val, i) => {
				return {
					description: val?.description,
					img: data?.section2Img[i],
				};
			});
			const section2Data = {
				heading: payload?.section2heading,
				item: section2Item,
			};
			const section3Data = {
				heading: payload?.section3heading,
				description: payload?.section3Description,
			};

			const content = {
				banner: bannerData,
				section1: section1Data,
				section2: section2Data,
				section3: section3Data,
			};

			const slug = await slugify(payload?.industryName);

			const industry = Industry.create({
				content,
				slug,
				industryName: payload?.industryName,
				logo: data?.iconImg,
				ShortDesc: payload?.infoShortDesc,
			});

			return {
				status: 200,
				data: [],
				message: 'Content saved successfully',
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
		console.log('main error: ' + e);
		return { status: 500, data: [], error: { message: 'Something went wrong !', reason: e.message } };
	}
};

export const listIndustry = async (request) => {
	try {
		const { payload } = request;

		const limit = 15;
		const page = payload?.page || 1;
		const offset = (page - 1) * limit;

		const { count, rows } = await Industry.findAndCountAll({
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
export const industryDetails = async (request) => {
	try {
		const {
			payload: { id },
		} = request;

		const industry = await Industry.findOne({ where: { id: id } });
		const data = {
			industry,
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
export const editIndustry = async (request) => {
	try {
		const { payload } = request;

		const formData = {
			section2Img: payload?.section2Img,
			bannerImg: payload?.bannerImg,
			bannerDisplayImg: payload?.bannerDisplayImg,
			iconImg: payload?.iconImg,
		};

		const result = await api.post('/api/upload-file', formData);

		if (result.data.status === 200) {
			const data = result.data.data;

			const bannerData = {
				img: data?.bannerImg,
				bannerDisplayImg: data?.bannerDisplayImg,

				heading: payload?.bannerHeading,
				description: payload?.bannerDescription,
			};
			const section1Data = {
				heading: payload?.section1heading,
				description: payload?.section1Description,
			};

			const section2Item = payload?.section2Item?.map((val, i) => {
				return {
					description: val?.description,
					img: data?.section2Img[i],
				};
			});
			const section2Data = {
				heading: payload?.section2heading,
				item: section2Item,
			};
			const section3Data = {
				heading: payload?.section3heading,
				description: payload?.section3Description,
			};

			const content = {
				banner: bannerData,
				section1: section1Data,
				section2: section2Data,
				section3: section3Data,
			};

			const slug = await slugify(payload?.industryName);

			const industry = Industry.update(
				{
					content,
					slug,
					industryName: payload?.industryName,
					logo: data?.iconImg,
					ShortDesc: payload?.infoShortDesc,
				},
				{
					where: {
						id: payload?.id,
					},
				}
			);

			return {
				status: 200,
				data: [],
				message: 'Content saved successfully',
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
		console.log('main error: ' + e);
		return { status: 500, data: [], error: { message: 'Something went wrong !', reason: e.message } };
	}
};

export const getPageContent = async (request) => {
	try {
		const { payload } = request;
		const content = await Content.findOne({ where: { page: payload.page } });
		return {
			status: 200,
			data: { content: JSON.parse(content?.content), fileBaseUrl: process.env.RESOURCE_API_URL },
			message: '',
		};
	} catch (e) {
		return { status: 500, data: [], error: { message: 'Something went wrong !', reason: e.message } };
	}
};
