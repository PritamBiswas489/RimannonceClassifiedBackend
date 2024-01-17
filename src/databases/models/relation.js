const relation = (db) => {
	const { User, Page, Drop, Product, Cart, PageAccess, Nft, Favorite, ArtistType, Ticket, TicketConversation, TicketType, UserAccount, Order, OrderProduct, OrderShipping, PrivateChat, Blog, Comment, GroupChat, Notification } = db;
	// User.hasMany(Page, {
	// 	foreignKey: 'userId',
	// });
	// User.belongsTo(ArtistType, {
	// 	foreignKey: 'artistType',
	// 	as: 'artistTypeDetail',
	// });
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
	// UserAccount.belongsTo(User, {
	// 	foreignKey: 'userId',
	// });
	// User.hasOne(UserAccount, {
	// 	foreignKey: 'userId',
	// });
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
