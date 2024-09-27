const { Client } = require("pg");
const { runMigrations } = require("./run-migrations");
const { runSeeders } = require("./run-seeders");

require("dotenv").config(); // Load environment variables
const dbName = process.env.DB_NAME;
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const dbPort = process.env.DB_PORT;
const dbHost = process.env.DB_HOST;

// Create DB if does not exist
exports.create_DB_If_Not_Exists = async () => {
    const client = new Client({
        user: dbUser,
        host: dbHost,
        password: dbPassword,
        port: dbPort,
        database: 'postgres', // Connect to default DB
    });

    try {
        await client.connect();
        await client.query(`CREATE DATABASE "${dbName}";`);
        console.log(`Database "${dbName}" created successfully.`);

        if (! await runMigrations()) return
        if (! await runSeeders()) return
    }
    catch (error) {
        if (error.code === '42P04') { //Database already exists
            console.log(`Database "${dbName}" already exists.`);
        } else {
            console.error("Error creating database:", error);
        }
    }
    finally {
        await client.end()
    }
};