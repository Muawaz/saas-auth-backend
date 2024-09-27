const { Sequelize } = require("sequelize");
const { util } = require('util');
const { create_DB_If_Not_Exists } = require("./create-db");
require("dotenv").config(); // Load environment variables

const dbName = process.env.DB_NAME;
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const dbPort = process.env.DB_PORT;
const dbHost = process.env.DB_HOST;

// Create a new Sequelize instance
const sequelize = new Sequelize(dbName, dbUser, dbPassword,
  {
    host: dbHost,
    dialect: "postgres",
    port: dbPort,
  }
);

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
