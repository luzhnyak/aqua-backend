const { waterServices } = require("../db/services");
const { ctrlWrapper } = require("../helpers");

const add = async (req, res) => {
  const dailyWater = await waterServices.add(req.body.date, req.body.water, req.user);
  dailyWater.owner = dailyWater.owner._id
  res.status(201).json(dailyWater)
}

const getCurrentDay = async (req, res) => {
  const { date } = req.params;
  const dailyWater = await waterServices.getCurrentDay(date.replaceAll('-', ' '), req.user);
  if (!dailyWater) return res.json({dailyEntries: [], progress: 0})
  res.json(dailyWater)
}

const update = async (req, res) => {
  const dailyWater = await waterServices.update(req.params.dayId, req.params.entryId, req.body);
  res.json(dailyWater)
}

const remove = async (req, res) => {
  const deleted = await waterServices.remove(req.params.dayId, req.params.entryId);
  res.json(deleted)
}

const getMonth = async (req, res) => {
  const date = new Date();
  const { user, query: { year = date.getFullYear(), month = date.toLocaleString('en', {month: 'long'})} } = req;
  let selectedDates = await waterServices.getMonth(year, month, user);
  selectedDates = selectedDates.map(i => {
    const [day, month] = i.date.split(' ')
      return {...i._doc,
      date: `${day}, ${month}`,
      waterRate: i.waterRate / 1000,
      dailyEntries: i.dailyEntries.length,}
  });
  res.json(selectedDates)
}

module.exports = {
  add: ctrlWrapper(add),
  getCurrentDay: ctrlWrapper(getCurrentDay),
  update: ctrlWrapper(update),
  remove: ctrlWrapper(remove),
  getMonth: ctrlWrapper(getMonth),
}