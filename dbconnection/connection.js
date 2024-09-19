const { Client } = require("pg");
const { Sequelize } = require("sequelize");
require("dotenv").config(); // Load environment variables

const dbName = process.env.DB_NAME;
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const dbPort = process.env.DB_PORT;
const dbHost = process.env.DB_HOST;

// Create a new Sequelize instance
const sequelize = new Sequelize( dbName, dbUser, dbPassword,
  {
    host: dbHost,
    dialect: "postgres",
    port: dbPort,
  }
);

// Create DB if does not exist
const create_DB_If_Not_Exists = async () => {
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


// Test the connection
const connectDB = async () => {
  try {
    await create_DB_If_Not_Exists(); // Ensuring db exists before authenticating
    await sequelize.authenticate();
    console.log(
      "Connection to the database has been established successfully."
    );
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

module.exports = { sequelize, connectDB };
