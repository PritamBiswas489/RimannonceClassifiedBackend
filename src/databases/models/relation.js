const relation = (db) => {
	const { Favorites, Announcement, AnnouncementMedia, User, Locations, SubLocations ,         Ticket, TicketConversation, TicketType,    Blog, Comment,    Notification } = db;
	 
	User.hasMany(Announcement, {
		foreignKey: 'createdBy',
		as: 'userAnnouncements',
	});

	User.hasMany(Favorites, {
		foreignKey: 'addedBy',
		as: 'userFavorites',
	});

	Locations.hasMany(SubLocations, {
		foreignKey: 'locationId',
		as: 'locationSublocation',
	});

	Announcement.belongsTo(User, {
		foreignKey: 'createdBy',
		as: 'announcementUser',
	});

	Announcement.hasMany(AnnouncementMedia, {
		foreignKey: 'announcementId',
		as: 'announcementMedias',
	});

	Announcement.belongsTo(Locations, {
		foreignKey: 'locationId',
		as: 'announcementLocation',
	});

	Announcement.belongsTo(SubLocations, {
		foreignKey: 'subLocationId',
		as: 'announcementSubLocation',
	});

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
