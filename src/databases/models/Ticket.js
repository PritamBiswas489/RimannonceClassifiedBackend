export default function Ticket(sequelize, DataTypes) {
	return sequelize.define(
		'Ticket',
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
            ticketType: {
				type: DataTypes.INTEGER,
                allowNull: true,
			},
			question: {
				type: DataTypes.STRING,
				allowNull: true,
			},
            status: {
				type: DataTypes.INTEGER,
                allowNull: true,
			},	
		},
		{
			underscored: true,
			tableName: 'tickets',
		}
	);
}