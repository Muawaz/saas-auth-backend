const {
  createcompagin,
  deletecompaginone,
  updatecompaginfield,
  allusercompagin,
} = require("../services/compagin.js");

async function createnewcompagin(req, res) {
  let data = req.body;
  // console.log(data);
  let newdata = await createcompagin(data);
  return res.status(200).json({
    status: 1,
    message: "Compagin Created Successfully",
    data: newdata,
  });
}

async function deletecompagin(req, res) {
  let compaginid = req.params.id;

  if (!compaginid) {
    return res
      .status(401)
      .json({ status: 0, message: "You are not authorized to delete" });
  }

  let dbresponse = await deletecompaginone(compaginid);
  return res.status(200).json({
    status: 1,
    message: "Compagin deleted successfully",
    data: dbresponse,
  });
}

async function updatecompagin(req, res) {
  let data = req.body;
  let id = req.params.id;
  console.log(data, id);
  if (!id || !data || Object.keys(data).length === 0) {
    return res.status(401).json({
      status: 0, // Use 0 for errors and 1 for success
      message: "Please provide the required data to update.",
    });
  }
  let updateindb = await updatecompaginfield(data, id);
  if (updateindb == 0) {
    return res.status(404).json({ status: 0, message: "Record not found" });
  }
  return res.status(200).json({
    status: 1,
    message: "Record updated successfully",
    data: updateindb,
  });
  // res.json({ data: data, id: id });
}

async function getcompagins(req, res) {
  // let userid = req.user.id from the middleware of authentication
  let { id } = req.params;
  console.log(id);

  if (!id) {
    return res
      .status(400)
      .json({ status: 0, message: "your are not authorized" });
  }
  // if (!data.userid) {
  //   res.status(401).json({ status: 0, message: "your are not authorized" });
  // }
  let usercompagin = await allusercompagin(id);
  if (usercompagin.length == 0) {
    return res.status(404).json({ status: 0, message: "No records found" });
  }
  return res
    .status(200)
    .json({ status: 1, message: "User all compagins", data: usercompagin });
}
module.exports = {
  createnewcompagin,
  deletecompagin,
  updatecompagin,
  getcompagins,
};
