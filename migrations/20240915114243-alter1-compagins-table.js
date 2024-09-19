"use strict";

const { sequelize } = require("../dbconnection/connection");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Compagins", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      compaginname: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      userid: {
        type: Sequelize.INTEGER,
        references: {
          model: "Users", // Name of the Users table
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      scheduled_at: {
        type: Sequelize.DATE, // Use DATE for both date and time
        allowNull: true, // You can decide if you want to allow it to be nullable or not
      },
      status: {
        type: Sequelize.STRING,
        allowNull: false, // Makes sure the status cannot be null
        defaultValue: "draft", // Sets default value as 'draft'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Compagins");
  },
};
