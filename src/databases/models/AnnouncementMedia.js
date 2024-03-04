export default function AnnouncementMedia(sequelize, DataTypes) {
    return sequelize.define(
		'AnnouncementMedia',
		{
			id: {
				type: DataTypes.INTEGER,
				autoIncrement: true,
				primaryKey: true,
			},
			uuid: {
				type: DataTypes.UUID,
				defaultValue: DataTypes.UUIDV4,
				unique: true,
			},
            announcementId:{
				type: DataTypes.INTEGER,
                defaultValue:0,
				allowNull: true,
			},
            filePath: {
				type: DataTypes.TEXT,
				allowNull: true,
			},
            fileType: {
				type: DataTypes.TEXT,
				allowNull: true,
			},
			fileMimeType : {
				type: DataTypes.TEXT,
				allowNull: true,
			},
			isConverted:{
				type: DataTypes.INTEGER,
                defaultValue:0,
				allowNull: true,
			}
		},
		{
			underscored: true,
			tableName: 'announcement_medias',
		}
	);

}