export default function Categories(sequelize, DataTypes) {
	return sequelize.define(
		'Categories',
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
            slugId:{
				type: DataTypes.TEXT,
				allowNull: true,
			},
            icon: {
				type: DataTypes.TEXT,
				allowNull: true,
			},
            iconImage: {
				type: DataTypes.TEXT,
				allowNull: true,
			},
			price : {
				type:DataTypes.DECIMAL(10, 2),
				defaultValue:0,
			},
            isPremium: {
				type: DataTypes.INTEGER,
				allowNull: true,
			},
            canDelete: {
				type: DataTypes.INTEGER,
				allowNull: true,
			},
            sortValue: {
				type: DataTypes.INTEGER,
				allowNull: true,
			},
		},
		{
			underscored: true,
			tableName: 'categories', 
		}
	);
}