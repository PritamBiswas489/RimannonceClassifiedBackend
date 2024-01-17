export default function Comment(sequelize, DataTypes) {
	return sequelize.define(
		'Comment',
		{
			id: {
				type: DataTypes.INTEGER,
				autoIncrement: true,
				primaryKey: true,
			},
			blogId: {
				type: DataTypes.INTEGER,
				allowNull: true,
			},
			parentId: {
				type: DataTypes.INTEGER,
				allowNull: true,
				defaultValue: 0,
			},
			commentBy: {
				type: DataTypes.INTEGER,
				allowNull: true,
			},
			comment: {
				type: DataTypes.TEXT,
				allowNull: true,
			},
		},
		{
			underscored: true,
			tableName: 'comments',
		}
	);
}
