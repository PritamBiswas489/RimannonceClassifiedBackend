export default function SiteContent(sequelize, DataTypes) {
	return sequelize.define(
		'SiteContent',
		{
			id: {
				type: DataTypes.INTEGER,
				autoIncrement: true,
				primaryKey: true,
			},
			title: {
				type: DataTypes.STRING,
				allowNull: true,
			},
            slug: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			description: {
				type: DataTypes.TEXT,
				allowNull: true,
			},
			
		},
		{
			underscored: true,
			tableName: ' site_contents',
		}
	);
}
