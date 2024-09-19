const User = require("./UserModel.js");
const Compagin = require("./compaginModel.js");

// Set up associations
User.hasMany(Compagin, { foreignKey: "userid" });
Compagin.belongsTo(User, { foreignKey: "userid" });
