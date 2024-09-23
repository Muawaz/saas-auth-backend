'use strict';

const { DataTypes } = require("sequelize");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Users',
      'otp', {
        type: DataTypes.STRING,
        allowNull: true,
      });

    await queryInterface.addColumn('Users',
      'otpExpire', {
        type: DataTypes.DATE,
        allowNull: true,
      });
      
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Users', 'otp');
    await queryInterface.removeColumn('Users', 'otpExpire');

    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
