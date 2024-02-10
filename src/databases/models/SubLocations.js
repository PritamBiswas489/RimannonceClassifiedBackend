export default function SubLocations(sequelize, DataTypes) {
	return sequelize.define(
		'SubLocations',
		{
			id: {
				type: DataTypes.INTEGER,
				autoIncrement: true,
				primaryKey: true,
			},
            name: {
				type: DataTypes.TEXT,
				allowNull: true,
			},
			frName: {
				type: DataTypes.TEXT,
				allowNull: true,
			},
			arName: {
				type: DataTypes.TEXT,
				allowNull: true,
			},
            locationId: {
				type: DataTypes.INTEGER,
				allowNull: true,
			},
		},
		{
			underscored: true,
			tableName: 'sublocations', 
		}
	);
}