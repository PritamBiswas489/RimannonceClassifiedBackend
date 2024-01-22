export default function Announcement(sequelize, DataTypes) {
    return sequelize.define(
		'Announcement',
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
			status: {
				type: DataTypes.ENUM,
				values: ['ACTIVE', 'INACTIVE'],
				allowNull: true,
				defaultValue: 'ACTIVE',
			},
		},
		{
			underscored: true,
			tableName: 'announcements',
		}
	);

}