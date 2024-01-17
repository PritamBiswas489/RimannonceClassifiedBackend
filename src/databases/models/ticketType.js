export default function TicketType(sequelize, DataTypes) {
	return sequelize.define(
		'ArtistType',
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
		},
		{
			underscored: true,
			tableName: 'ticket_types',
		}
	);
}