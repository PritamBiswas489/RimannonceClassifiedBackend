export default function ContactUs(sequelize, DataTypes) {
	return sequelize.define(
		'ContactUs',
		{
			id: {
				type: DataTypes.INTEGER,
				autoIncrement: true,
				primaryKey: true,
			},
            userId: {
				type: DataTypes.INTEGER,
				allowNull: true,
			},
            subject: {
				type: DataTypes.TEXT,
				allowNull: true,
			},
            message: {
				type: DataTypes.TEXT,
				allowNull: true,
			}, 
		},
		{
			underscored: true,
			tableName: 'contact_us', 
		}
	);
}
