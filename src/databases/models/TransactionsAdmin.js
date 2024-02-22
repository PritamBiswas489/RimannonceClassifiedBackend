export default function TransactionsAdmin(sequelize, DataTypes) {
	return sequelize.define(
		'TransactionsAdmin',
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
            amount: {
				type: DataTypes.INTEGER,
				allowNull: true,
			},
		},
		{
			underscored: true,
			tableName: 'transactions_admin', 
		}
	);
}