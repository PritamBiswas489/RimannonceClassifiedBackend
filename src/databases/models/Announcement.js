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
			price : {
				type:DataTypes.DECIMAL(10, 2),
				defaultValue:0,
			},
			category: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			description: {
				type: DataTypes.TEXT,
				allowNull: true,
			},
			locationId: {
				type: DataTypes.INTEGER,
				defaultValue:0,
				allowNull: true,
			},
			location: {
				type: DataTypes.TEXT,
				allowNull: true,
			},
			subLocationId: {
				type: DataTypes.INTEGER,
				defaultValue:0,
				allowNull: true,
			},
			subLocation: {
				type: DataTypes.TEXT,
				allowNull: true,
			},
			gpDeliveryOrigin: {
				type: DataTypes.TEXT,
				allowNull: true,
			},
			gpDeliveryDestination: {
				type: DataTypes.TEXT,
				allowNull: true,
			},
			gpDeliveryDate: {
				type: DataTypes.DATE,
				allowNull: true,
			},
			phoneCountryCode:{
				type: DataTypes.TEXT,
				allowNull: true,
			},
			contactNumber: {
				type: DataTypes.TEXT,
				allowNull: true,
			},
			isPremium: {
				type: DataTypes.INTEGER,
				defaultValue:0,
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