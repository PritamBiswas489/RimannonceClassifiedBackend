import db from '../databases/models/index.js';
const { BlogLike, User } = db;

export const getData = async (request) => {
    try {
        const {
			payload,
            user
		} = request;

        const check = await BlogLike.count({
			where: { userId: user.id, blogId: payload?.blogId },
		});
        const countData = await BlogLike.count({
			where: { blogId: payload?.blogId },
		});
       
		return {
			status: 200,
			data: {check,countData},
			message: 'Success',
			error: {},
		};
	} catch (e) {
		return { status: 500, data: [], error: { message: 'Something went wrong !', reason: e.message } };
	}

}
export const createLike = async (request) => {
    
	try {
        const {
			payload,
            user
		} = request;

        const check = await BlogLike.count({
			where: { userId: user.id, blogId: payload?.blogId },
		});

        if(check === 0){
            await BlogLike.create({
                userId: user.id,
                blogId: payload?.blogId,	 
            });
        }else{
            await BlogLike.destroy({
                where: {
                    userId: user.id,
                    blogId: payload?.blogId,	 
                },
              })
        }
        const countData = await BlogLike.count({
			where: { blogId: payload?.blogId },
		});
       
		return {
			status: 200,
			data: countData,
			message: 'Success',
			error: {},
		};
	} catch (e) {
		return { status: 500, data: [], error: { message: 'Something went wrong !', reason: e.message } };
	}
};
 