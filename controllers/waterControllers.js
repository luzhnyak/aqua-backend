const { waterServices } = require("../db/services");
const { HttpError, ctrlWrapper } = require("../helpers");

const add = async (req, res) => {
  res.status(201).json(await waterServices.add(req.body, req.user))
}

module.exports = {
  add: ctrlWrapper(add)
}