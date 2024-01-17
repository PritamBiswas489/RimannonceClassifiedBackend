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
			userName: {
				type: DataTypes.STRING,
				allowNull: true,
				unique: true,
			},
			email: {
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
			banner: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			fbLink: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			twLink: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			instaLink: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			about: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			artistType: {
				type: DataTypes.INTEGER,
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
