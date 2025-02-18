const { sequelize } = require("../dbconnection/connection.js");
const { DataTypes } = require("sequelize");
// const Compagin = require("../models/compaginModel.js");

const User = sequelize.define(
  "User",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false, // Default value is unverified
    },
    role: {
      type: DataTypes.STRING,
      defaultValue: "user",
    },
    verificationToken: {
      type: DataTypes.STRING,
    },
    otp: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    otpExpire: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    timestamps: true,
    defaultScope: {
      attributes: { exclude: ['password'] },
    },
    scopes: {
      with_Password: {
        attributes: { include: ['password'] },
      },
    },
  }
);
// console.log(Compagin, "from user model");

// User.hasMany(Compagin, { foreignKey: "userId" });

module.exports = User;
