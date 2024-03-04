import db from '../databases/models/index.js';
const { Announcement, User, Locations, SubLocations, AnnouncementMedia, Categories, Favorites, Report, Op, Transactions, Settings, sequelize } = db;
import path, { resolve as pathResolve, dirname, join as pathJoin, sep } from 'path';
import ffmpeg from 'fluent-ffmpeg';
import {fileTypeFromFile} from 'file-type';
export const processMovConvertProcess = async () => {
	const { rows } = await AnnouncementMedia.findAndCountAll({
		where: {
			fileMimeType: 'video/quicktime',
			isConverted: 0,
		},
	});
	if (rows.length > 0) {
		rows.forEach((inputFile) => {
			const fileName = path.basename(inputFile.filePath);
			const folder = pathResolve(pathJoin(dirname('./'), 'upload-announcement-files'));
			const outputFileName = path.basename(inputFile.filePath, path.extname(inputFile.filePath)) + '.mp4';
			const inpFile = `${folder}/${fileName}`;
			const outputFile = `${folder}/${outputFileName}`;
			ffmpeg(inpFile)
				.outputOptions('-c:v', 'libx264')
				.on('error', async function (err) {
					const response = await AnnouncementMedia.update(
                        {  isConverted : 2 },
                        {
                            where: {
                                id: inputFile.id,
                            },
                        }
                    );
				})
				.on('end', async function () {
                    const getFileType = await fileTypeFromFile(outputFile)
                    const filePath = 'upload-announcement-files/'+outputFileName;
					const response = await AnnouncementMedia.update(
                        { fileMimeType: getFileType?.mime , isConverted : 1, filePath :filePath },
                        {
                            where: {
                                id: inputFile.id,
                            },
                        }
                    );
					 
				 })
				.save(outputFile);
		});
	}
	 
};
