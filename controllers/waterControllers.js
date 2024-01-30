const { waterServices } = require("../db/services");
const { ctrlWrapper } = require("../helpers");

exports.add = ctrlWrapper(async (req, res) => {
  const dailyWater = await waterServices.add(req.body, req.user);
  dailyWater.owner = dailyWater.owner._id
  res.status(201).json(dailyWater)
})

exports.getCurrentDay = ctrlWrapper(async (req, res) => {
  const dailyWater = await waterServices.getCurrentDay(req.user);
  dailyWater.owner = dailyWater.owner._id
  res.json(dailyWater)
})

exports.update = ctrlWrapper(async (req, res) => {
  const dailyWater = await waterServices.update(req.params.dayId, req.params.entryId, req.body);
  res.json(dailyWater)
})

exports.remove = ctrlWrapper(async (req, res) => {
  const deleted = await waterServices.remove(req.params.dayId, req.params.entryId);
  res.json(deleted)
})

exports.getMonth = ctrlWrapper(async (req, res) => {
  const date = new Date();
  const { user, query: { year = date.getFullYear(), month = date.getMonth()} } = req;
  let selectedDates = await waterServices.getMonth(year, month, user);
  selectedDates = selectedDates.map(i => ({ ...i._doc, dailyEntries: i.dailyEntries.length }));
  res.json(selectedDates)
})