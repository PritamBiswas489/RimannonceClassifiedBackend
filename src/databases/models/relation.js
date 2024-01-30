const relation = (db) => {
	const { Favorites, Announcement, User,         Ticket, TicketConversation, TicketType,    Blog, Comment,    Notification } = db;
	 
	Favorites.belongsTo(Announcement, {
		foreignKey: 'announcementId',
		as: 'favoritesAnnouncement',
	});

	Ticket.belongsTo(TicketType, {
		foreignKey: 'ticketType',
		as: 'ticketTypeDetail',
	});
	Ticket.belongsTo(User, {
		foreignKey: 'userId',
		as: 'userDetail',
	});
	TicketConversation.belongsTo(User, {
		foreignKey: 'fromUserId',
		as: 'userDetail',
	});
	 
	Blog.belongsTo(User, {
		foreignKey: 'createdBy',
		as: 'blogOwner',
	});
	Blog.hasMany(Comment, {
		foreignKey: 'blogId',
		as: 'comments',
	});
	Comment.belongsTo(User, {
		foreignKey: 'commentBy',
		as: 'commentedBy',
	});
	Notification.belongsTo(User, {
		foreignKey: 'fromId',
		as: 'fromUser',
	});
	Notification.belongsTo(User, {
		foreignKey: 'toId',
		as: 'toUser',
	});
};
export default relation;
