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
			isPromoted: {
				type: DataTypes.INTEGER,
			},
		},
		{
			underscored: true,
			tableName: 'users',
		}
	);
}