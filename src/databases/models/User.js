export default function User(sequelize, DataTypes) {
	return sequelize.define(
		'User',
		{
			id: {
				type: DataTypes.INTEGER,
				autoIncrement: true,
				primaryKey: true,
			},
			name: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			email: {
				type: DataTypes.STRING,
				allowNull: true,
				unique: true,
			},
			phoneCountryCode:{
				type: DataTypes.STRING,
				allowNull: true,
			},
			phone: {
				type: DataTypes.STRING,
				allowNull: true,
				unique: true,
			},
			password: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			avatar: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			role: {
				type: DataTypes.ENUM,
				values: ['ADMIN', 'USER', 'SELLER', 'BOTH'],
				allowNull: true,
				defaultValue: 'USER',
			},
			loggedInAs: {
				type: DataTypes.ENUM,
				values: ['ADMIN', 'USER', 'SELLER', 'BOTH'],
				allowNull: true,
				defaultValue: 'USER',
			},
			walletAmount:{
				type:DataTypes.DECIMAL(10, 2),
				defaultValue:0,
			},
			language: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			isPromoted: {
				type: DataTypes.INTEGER,
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
			tableName: 'users',
		}
	);
}
