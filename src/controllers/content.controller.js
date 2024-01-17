import db from '../databases/models/index.js';
import { default as api } from '../config/apiConfig.js';
import { slugify } from '../libraries/utility.js';
import { smtpConnection } from '../config/mail.config.js';
import { resolve as pathResolve, dirname, join as pathJoin } from 'path';
import { generateHtmlTemplate, generateOtp } from '../libraries/utility.js';
const { ACCESS_TOKEN_SECRET_KEY, REFRESH_TOKEN_SECRET_KEY, JWT_ALGO, ACCESS_TOKEN_EXPIRES_IN, REFRESH_TOKEN_EXPIRES_IN, MAIL_FROM, NODE_ENV } = process.env;

const { Drop, Nft, Product, SiteContent, HomeContent, AboutContent, ContactUs,  Op } = db;

const generateSlug = async (siteContent) => {
    siteContent.slug = slugify(siteContent.title, { lower: true });
  
    // If you want to make sure the generated slug is unique, you can add a counter
    let counter = 1;
    const originalSlug = siteContent.slug;
    // console.log(siteContent);
  
    const generateUniqueSlug = async () => {
      const existingSiteContent = await SiteContent.findOne({ where: { slug: siteContent.slug } });
      if (existingSiteContent) {
        // If a record with the same slug exists, append the counter to the original slug
        siteContent.slug = `${originalSlug}-${counter}`;
        counter++;
        return generateUniqueSlug();
      }
      return null;
    };
  
    return generateUniqueSlug();
  };

export const createContent = async (request) => {
    
	try {
		const { payload, user } = request;
        let  slug = slugify(payload.title);

        const existingSiteContent = await SiteContent.findOne({ where: { slug: slug } });
        if (existingSiteContent) {
        
            slug = `${existingSiteContent.slug}-1`;
        }
		const insertedData = {
			title: payload.title,
			description: payload.description,
		};
        await generateSlug(insertedData);
        const result = await SiteContent.create(insertedData);
	
		return {
            status: 200,
            data: {},
            message: 'Content created successfully',
            error: {},
        };
	} catch (e) {
		return { status: 500, data: [], error: { message: 'Something went wrong !', reason: e.message } };
	}
};
export const homeSaveContent = async (request) => {
    try {
		const { payload, user } = request;

        const insertedData = {
			contents: JSON.stringify(payload.contents),
		};

        if(payload?.images?.homebannerImage && payload?.images?.homebannerImage!==''){
            const result = await api.post('/api/upload-file', {
                attachment: payload?.images?.homebannerImage,
            });
            if(result?.data?.data?.attachment){
                insertedData.imageOne = result?.data?.data?.attachment;
            }
        }
        if(payload?.images?.pointOneImage && payload?.images?.pointOneImage!==''){
            const result = await api.post('/api/upload-file', {
                attachment: payload?.images?.pointOneImage,
            });
            if(result?.data?.data?.attachment){
                insertedData.imageTwo = result?.data?.data?.attachment;
            }
        }
        if(payload?.images?.pointTwoImage && payload?.images?.pointTwoImage!==''){
            const result = await api.post('/api/upload-file', {
                attachment: payload?.images?.pointTwoImage,
            });
            if(result?.data?.data?.attachment){
                insertedData.imageThree = result?.data?.data?.attachment;
            }
        }
        if(payload?.images?.pointThreeImage && payload?.images?.pointThreeImage!==''){
            const result = await api.post('/api/upload-file', {
                attachment: payload?.images?.pointThreeImage,
            });
            if(result?.data?.data?.attachment){
                insertedData.imageFour = result?.data?.data?.attachment;
            }
        }
        if(payload?.images?.TipPanelImage && payload?.images?.TipPanelImage!==''){
            const result = await api.post('/api/upload-file', {
                attachment: payload?.images?.TipPanelImage,
            });
            if(result?.data?.data?.attachment){
                insertedData.imageFive = result?.data?.data?.attachment;
            }
        }
      
        const check  = await HomeContent.findOne();
        if(check?.id){
            const result = await HomeContent.update(insertedData, { where: { id: check.id } });
        }else{
            const result = await HomeContent.create(insertedData);
        }
        return {
            status: 200,
            data: payload,
            message: 'Content saved successfully',
            error: {},
        };

    } catch (e) {
        return { status: 500, data: [], error: { message: 'Something went wrong !', reason: e.message } };
    }

}
export const getHomeContent  = async (request) => {
    try {
        const check  = await HomeContent.findOne();
        return {
            status: 200,
            data: check,
            message: 'Content saved successfully',
            error: {},
        };

    } catch (e) {
        return { status: 500, data: [], error: { message: 'Something went wrong !', reason: e.message } };
    }

}

export const contactUsSaveContent = async (request) => {
    try {
		const { payload, user } = request;

        const insertedData = {
			address: payload.address,
            phoneOne: payload.phoneOne,
            phoneTwo: payload.phoneTwo,
            email: payload.email,
            website: payload.website,
		};

        const check  = await ContactUs.findOne();
        if(check?.id){
            const result = await ContactUs.update(insertedData, { where: { id: check.id } });
        }else{
            const result = await ContactUs.create(insertedData);
        }
        return {
            status: 200,
            data: payload,
            message: 'Content saved successfully',
            error: {},
        };

    } catch (e) {
        return { status: 500, data: [], error: { message: 'Something went wrong !', reason: e.message } };
    }

}
export const getContactUsContent  = async (request) => {
    try {
        const check  = await ContactUs.findOne();
        return {
            status: 200,
            data: check,
            message: 'Content saved successfully',
            error: {},
        };

    } catch (e) {
        return { status: 500, data: [], error: { message: 'Something went wrong !', reason: e.message } };
    }

}


export const aboutSaveContent = async (request) => {
    try {
		const { payload, user } = request;

        const insertedData = {
			contents: JSON.stringify(payload.contents),
		};

        if(payload?.images?.aboutbannerImage && payload?.images?.aboutbannerImage!==''){
            const result = await api.post('/api/upload-file', {
                attachment: payload?.images?.aboutbannerImage,
            });
            if(result?.data?.data?.attachment){
                insertedData.imageOne = result?.data?.data?.attachment;
            }
        }
        if(payload?.images?.pointOneImage && payload?.images?.pointOneImage!==''){
            const result = await api.post('/api/upload-file', {
                attachment: payload?.images?.pointOneImage,
            });
            if(result?.data?.data?.attachment){
                insertedData.imageTwo = result?.data?.data?.attachment;
            }
        }
        if(payload?.images?.pointTwoImage && payload?.images?.pointTwoImage!==''){
            const result = await api.post('/api/upload-file', {
                attachment: payload?.images?.pointTwoImage,
            });
            if(result?.data?.data?.attachment){
                insertedData.imageThree = result?.data?.data?.attachment;
            }
        }
        
        
        const check  = await AboutContent.findOne();
        if(check?.id){
            const result = await AboutContent.update(insertedData, { where: { id: check.id } });
        }else{
            const result = await AboutContent.create(insertedData);
        }
        return {
            status: 200,
            data: payload,
            message: 'Content saved successfully',
            error: {},
        };

    } catch (e) {
        return { status: 500, data: [], error: { message: 'Something went wrong !', reason: e.message } };
    }

}
export const getAboutContent  = async (request) => {
    try {
        const check  = await AboutContent.findOne();
        return {
            status: 200,
            data: check,
            message: 'Content saved successfully',
            error: {},
        };

    } catch (e) {
        return { status: 500, data: [], error: { message: 'Something went wrong !', reason: e.message } };
    }

}


export const details = async (request) => {
	try {
		const { payload, user } = request;

		const blogDetails = await SiteContent.findOne({ where: { id: payload.id } });

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

export const detailsBySlug = async (request) => {
	try {
		const { payload, user } = request;

		const blogDetails = await SiteContent.findOne({ where: { slug: payload.slug } });

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




export const listContent = async (request) => {
    try {
		const { payload, user } = request;

		const limit = 15;
		const page = payload?.page || 1;
		const offset = (page - 1) * limit;

		const { count, rows } = await SiteContent.findAndCountAll({
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

}
export const listContentAll =  async (request) => {
    try {
		const { payload, user } = request;
		const limit = 15;
		const page = payload?.page || 1;
		const offset = (page - 1) * limit;

		const { count, rows } = await SiteContent.findAndCountAll({
			order: [['id', 'DESC']],
		});

		const data = {
			meta: {
				totalRecords: count,
			},
			records: rows,
		};
        const homeContentData  = await HomeContent.findOne();
		return {
			status: 200,
			data: data,
            homeContentData,
			message: 'Records fetched',
			error: {},
		};
	} catch (e) {
		return { status: 500, data: [], error: { message: 'Something went wrong !', reason: e.message } };
	}

}
export const editContent = async (request) => {
    try {
		const { payload, user } = request;
        let  slug = slugify(payload.title);

        const existingSiteContent = await SiteContent.findOne({ where: { slug: slug } });
        if (existingSiteContent) {
        
            slug = `${existingSiteContent.slug}-1`;
        }
		const insertedData = {
			title: payload.title,
			description: payload.description,
		};
        //await generateSlug(insertedData);
        const blogData = await SiteContent.update(insertedData, { where: { id: payload.id } });
	
		return {
            status: 200,
            data: {},
            message: 'Content updated successfully',
            error: {},
        };
	} catch (e) {
		return { status: 500, data: [], error: { message: 'Something went wrong !', reason: e.message } };
	}

}
export const destroy = async (request) => {
    try {
		const { payload, user } = request;

		const blogDetails = await SiteContent.destroy({ where: { id: payload.id } });

		return {
			status: 200,
			data: blogDetails,
			message: 'Record deleted successfully !',
			error: {},
		};
	} catch (e) {
		return { status: 500, data: [], error: { message: 'Something went wrong !', reason: e.message } };
	}

}
export const sendContactUsEmail =  async (request) => {
    try {
		const { payload  } = request;

        const subject = payload.contactUsSubject;
        const message  = payload.contactUsMessage;
        const fromName   = payload.contactUsName;
        const email   = payload.contactUsEmail;

        const connection = smtpConnection();
        const htmlPath =
			NODE_ENV === 'development' ? pathResolve(pathJoin(dirname('./'), 'src/view/email/email.html')) : pathResolve(pathJoin(dirname('./'), '..', 'src/view/email/email.html'));
		const htmlToSend = await generateHtmlTemplate(htmlPath, { subject, message,fromName, email });

		const mailOptions = {
			from: MAIL_FROM,
			to:  payload.email,
			subject: payload.contactUsSubject,
			html: htmlToSend,
			attachments: [
				{
					filename: 'logo.png',
					path:
						NODE_ENV === 'development'
							? pathResolve(pathJoin(dirname('./'), 'public/images/logo.png'))
							: pathResolve(pathJoin(dirname('./'), '..', 'public/images/logo.png')),
					cid: 'unique@logo', //same cid value as in the html img src
				},
			],
		};
		// console.log(mailOptions);
		connection.sendMail(mailOptions);



		return {
			status: 200,
			data: mailOptions,
			message: 'Email send successfully !',
			error: {},
		};
	} catch (e) {
		return { status: 500, data: [], error: { message: 'Something went wrong !', reason: e.message } };
	}

}