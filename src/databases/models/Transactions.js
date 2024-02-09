export default function Transactions(sequelize, DataTypes) {
	return sequelize.define(
		'Transactions',
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
            announcementId: {
				type: DataTypes.INTEGER,
				allowNull: true,
			},
            amount: { 
                type:DataTypes.DECIMAL(10, 2),
				defaultValue:0,
            }
		},
		{
			underscored: true,
			tableName: 'transactions', 
		}
	);
}