export default function Blog(sequelize, DataTypes) {
	return sequelize.define(
		'Blog',
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
			title: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			description: {
				type: DataTypes.TEXT,
				allowNull: true,
			},
			createdBy: {
				type: DataTypes.INTEGER,
				allowNull: true,
			},
			attachment: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			attachmentType: {
				type: DataTypes.ENUM,
				values: ['IMAGE', 'VIDEO', 'AUDIO', 'FILE'],
				allowNull: true,
			},
			privacy: {
				type: DataTypes.ENUM,
				values: ['PRIVATE', 'PUBLIC'],
				allowNull: true,
				defaultValue: 'PUBLIC',
			},
			status: {
				type: DataTypes.ENUM,
				values: ['ACTIVE', 'INACTIVE'],
				allowNull: true,
				defaultValue: 'ACTIVE',
			},
		},
		{
			underscored: true,
			tableName: 'blogs',
		}
	);
}
