export default function TicketConversation(sequelize, DataTypes) {
	return sequelize.define(
		'TicketConversation',
		{
			id: {
				type: DataTypes.INTEGER,
				autoIncrement: true,
				primaryKey: true,
			},
            fromUserId: {
				type: DataTypes.INTEGER,
                allowNull: true,
			},
            ticketId: {
				type: DataTypes.INTEGER,
                allowNull: true,
			},
			message: {
				type: DataTypes.STRING,
				allowNull: true,
			},
		},
		{
			underscored: true,
			tableName: 'ticket_conversations',
		}
	);
}