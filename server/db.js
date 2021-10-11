const Pool = require("pg").Pool;

const pool = new Pool({
	user: "postgre",
	password: "DMaws2021",
	host: "map-data.cyw0y7izcoh0.us-east-1.rds.amazonaws.com",
	port: 5432,
	database: "websitedata"



});

module.exports = pool;
