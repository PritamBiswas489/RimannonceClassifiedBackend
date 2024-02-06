export default function Locations(sequelize, DataTypes) {
	return sequelize.define(
		'Locations',
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
		},
		{
			underscored: true,
			tableName: 'locations', 
		}
	);
}