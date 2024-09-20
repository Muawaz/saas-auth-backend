"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Compagins", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      compaginname: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      userid: {
        type: Sequelize.INTEGER,
        references: {
          model: "Users", // Reference the Users table
          key: "id",
        },
        onUpdate: "CASCADE", // Update the userid if the User id changes
        onDelete: "CASCADE", // Delete the Compagins if the User is deleted
        allowNull: false,
      },
      status: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "draft",
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
