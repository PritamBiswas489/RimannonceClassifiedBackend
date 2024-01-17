import './environment.js';
import Pusher from 'pusher';
const { PUSHER_APP_ID, PUSHER_APP_KEY, PUSHER_APP_SECRET, PUSHER_CLUSTER } = process.env;

const pusher = new Pusher({
	appId: PUSHER_APP_ID,
	key: PUSHER_APP_KEY,
	secret: PUSHER_APP_SECRET,
	cluster: PUSHER_CLUSTER,
	encrypted: true,
});

export default pusher;

// https://www.velotio.com/engineering-blog/scalable-real-time-communication-with-pusher
// https://techblog.geekyants.com/implementing-in-app-chat-using-pusher
