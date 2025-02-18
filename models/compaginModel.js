const { sequelize } = require("../dbconnection/connection.js");
const { DataTypes } = require("sequelize");
// const User = require("./UserModel.js");

const Compagin = sequelize.define("Compagin", {
  compaginname: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  userid: {
    type: DataTypes.INTEGER,
    references: {
      model: "User", // Reference the User model
      key: "id",
    },

    onUpdate: "CASCADE", // Optional: If the User id changes, update in Compagin too
    onDelete: "CASCADE", // Optional: If a User is deleted, delete all associated Compagins
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false, // Makes sure the status cannot be null
    defaultValue: "draft", // Sets default value as 'draft'
  },
});

// Compagin.belongsTo(User, { foreignKey: "userId" });

module.exports = Compagin;
