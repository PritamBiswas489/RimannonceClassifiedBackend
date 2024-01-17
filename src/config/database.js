import './environment.js';
const dbConfig = {
	username: process.env.DB_USERNAME || 'root',
	password: process.env.DB_PASSWORD,
	database: process.env.DB_DATABASE || 'aqualeaf_website',
	options: {
		host: process.env.DB_HOST || 'localhost',
		dialect: 'mysql',
		pool: {
			max: 5,
			min: 0,
			acquire: 3000,
			idle: 1000,
		},
		timezone: '+00:00',
	},
};
export default dbConfig;
