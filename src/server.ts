import dotenv from 'dotenv';
import path from 'path';
dotenv.config({
	path: path.join(__dirname, '../.env'),
});
import express from 'express';

import { Express } from './express';
const PORT = process.env.PORT || 3020;

const run = async () => {
	Express.setEnv();
	if (Express.checkEnvironment()) {
		const server = new Express(express);
		await server.bootExpress(express);
		server.app.listen(PORT, () => {
			console.log('Server is listening on Port:', PORT);
		});
	} else {
		process.exit(1);
	}
}

run();

