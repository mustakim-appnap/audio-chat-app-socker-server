'use strict';

const mysql = require('mysql');
// const config = require('config');

class Database {
	constructor() {
		this.connection = mysql.createPool({
			connectionLimit: 100,
			host: 'localhost',
			user: 'root',
			password: '',
			database: 'friends_map',
			debug: false
		});
	}
	query(sql, args) {
		return new Promise((resolve, reject) => {
			this.connection.query(sql, args, (err, rows) => {
				if (err)
					return reject(err);
				resolve(rows);
			});
		});
	}
	close() {
		return new Promise((resolve, reject) => {
			this.connection.end(err => {
				if (err)
					return reject(err);
				resolve();
			});
		});
	}
}
module.exports = new Database();
