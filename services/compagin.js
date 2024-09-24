// const { sequelize } = require("../dbconnection/connection.js");
const { where } = require("sequelize");
const Compagin = require("../models/compaginModel.js");
exports.createcompagin = async (data) => {
  let name = data;
  console.log(name.scheduled_at, "from ser kompagin");

  try {
    let saveindb = await Compagin.create({
      compaginname: data.compaginname,
      userid: data.userid,
      status: data.status,
      scheduled_at: data.scheduled_at,
    });
    return saveindb;
  } catch (error) {
    throw new Error(`Error in creating new compagin: ${error.message}`);
  }
};

exports.deletecompaginone = async (id) => {
  console.log(id, "compagin id from services");
  try {
    let deleted = await Compagin.destroy({
      where: {
        id: id,
      },
    });
    return deleted;
  } catch (error) {
    throw new Error(`Error in creating new compagin: ${error.message}`);
  }
};

exports.updatecompaginfield = async (data, id) => {
  console.log(data, id, "from services while updating the record");
  try {
    let record = await Compagin.findByPk(id);
    // console.log(record, "From kkkkk");

    if (record == null) {
      return 0;
    }
    let updaterecord = await Compagin.update(
      {
        compaginname: data.compaginname,
        status: data.status,
        scheduled_at: data.scheduled_at,
      },
      {
        where: {
          id: id,
        },
      }
    );
    return updaterecord;
    // console.log(record, "PK");
  } catch (error) {
    throw new Error(`Error while updating the record ${error.message}`);
  }
};

exports.allusercompagin = async (id) => {
  try {
    // let userdata = await Compagin.count({
    //   where: {
    //     userid: id,
    //   },
    // });
    // return userdata;
    let findusercompagin = Compagin.findAll({
      where: {
        userid: id,
      },
    });
    return findusercompagin;
  } catch (error) {
    throw new Error(`Error while getting the record ${error.message}`);
  }
};
