import dbConfig from '../../config/database.js';
import { fileURLToPath, pathToFileURL } from 'url';
import { readdirSync } from 'fs';
import { dirname, join, basename as _basename } from 'path';
import chalk from 'chalk';
import { Sequelize, DataTypes, Op } from 'sequelize';
import relation from './relation.js';

const { database, password, username, options } = dbConfig;

const sequelize = new Sequelize(database, username, password, options);

const baseFilename = _basename(fileURLToPath(import.meta.url));

(async () => {
	try {
		await sequelize.authenticate();
		// eslint-disable-next-line no-console
		console.log(`${chalk.green('CONNECTED')} : Database Successfully Connected`);
	} catch (error) {
		// eslint-disable-next-line no-console
		console.error(`${chalk.red('CONNECTION ERROR')} : `, error.message);
	}
})();

const db = {};
await (async () => {
	const modelDirectoryPath = dirname(fileURLToPath(import.meta.url));
	const allModelFiles = readdirSync(modelDirectoryPath).filter((file) => file.indexOf('.') !== 0 && file !== baseFilename && file.slice(-3) === '.js' && file !== 'relation.js');
	// eslint-disable-next-line no-restricted-syntax
	for (const file of allModelFiles) {
		const modelFile = join(modelDirectoryPath, file);
		// eslint-disable-next-line no-await-in-loop
		const { default: model } = await import(pathToFileURL(modelFile));
		db[model.name] = model(sequelize, DataTypes);
	}
})();
relation(db);

sequelize.sync();
db.Op = Op;
db.Sequelize = Sequelize;
db.sequelize = sequelize;

export default db;
