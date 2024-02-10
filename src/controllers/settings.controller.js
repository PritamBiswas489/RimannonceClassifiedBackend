import db from '../databases/models/index.js';
import '../config/environment.js';
const { Settings, Op, Categories, Locations, SubLocations } = db;

export const getSettings = async (request) => {
    try {
		const { payload  } = request;
        const rows = await Settings.findAll()
        const settingData = {};
        rows.forEach((rowData,rowKey)=>{
            settingData[rowData.keyValue] = rowData.dataValue;
        })
		const cats = await Categories.findAll({
			order: [['sortValue', 'ASC']],
		})
		const locs =  await Locations.findAll({

			include : {
				model : SubLocations,
				as: 'locationSublocation'
			}
		})
		

		const catvalues=[];
		cats.forEach((cvalue,cindex)=>{
			catvalues.push({
				id: cvalue.slugId,
				name:  cvalue.name,
				frName:  cvalue.frName,
				arName:  cvalue.arName,
				icon: cvalue.icon,
				iconImage: cvalue.iconImage,
				price: cvalue.price,
				isPremium: cvalue.isPremium,
			  })
		})
		const subLocsValues = [];

		locs.forEach((locvalue,locindex)=>{
			if(locvalue.locationSublocation.length >0 ){
				subLocsValues.push({
					location_id: locvalue.id,
					locations:locvalue?.locationSublocation
				})
			}

		})

	

		settingData.categories = catvalues;
		settingData.locations = locs
		settingData.subLocations = subLocsValues;
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