import db from '../databases/models/index.js';
import '../config/environment.js';
const { Settings, Op } = db;

export const getSettings = async (request) => {
    try {
		const { payload  } = request;
        const rows = await Settings.findAll()
        const settingData = {};
        rows.forEach((rowData,rowKey)=>{
            settingData[rowData.keyValue] = rowData.dataValue;
        })
		return {
			status: 200,
			data: settingData,
			message: '',
			error: {},
		};
	} catch (e) {
		return { status: 500, data: [], error: { message: 'Something went wrong !', reason: e.message } };
	}
}