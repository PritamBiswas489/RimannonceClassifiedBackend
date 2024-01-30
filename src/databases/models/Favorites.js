export default function Favorites(sequelize, DataTypes) {
	return sequelize.define(
		'Favorites',
		{
			id: {
				type: DataTypes.INTEGER,
				autoIncrement: true,
				primaryKey: true,
			},
            addedBy: {
				type: DataTypes.INTEGER,
				allowNull: true,
			},
            announcementId:{
				type: DataTypes.INTEGER,
                defaultValue:0,
				allowNull: true,
			},
		},
		{
			underscored: true,
			tableName: 'favorites', 
		}
	);
}
