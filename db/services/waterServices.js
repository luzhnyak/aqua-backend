const { Types } = require("mongoose");
const { HttpError } = require("../../helpers");
const { Water } = require("../models/water");

exports.add = async (date, data, owner) => {
    const waterList = await Water.findOne({
        date,
        owner,
    });
    if (waterList) {
        return Water.findByIdAndUpdate(
            waterList._id,
            {
                $inc: { totalVolume: +data.waterVolume },
                $push: { dailyEntries: data },
            },
            { new: true }
        );
    }
    return Water.create({
      date,
      waterRate: owner.waterRate,
        totalVolume: data.waterVolume,
        dailyEntries: [data],
        owner,
    });
};

exports.getCurrentDay = async (date, owner) => {
  return Water.findOne({date, owner})
};

exports.update = async (dayId, entryId, data) => {
  const day = await Water.findById(dayId);
  if (!day) throw HttpError(404, "Day entry does not exist");
  const entry = day.dailyEntries.find((i) => i._id.toString() === entryId);
  if (!entry) throw HttpError(404, "Entry not found");
  return Water.findOneAndUpdate(
    { _id: dayId, "dailyEntries._id": entryId },
    {
      $inc: { totalVolume: +(data.waterVolume - entry.waterVolume) },
      $set: {
        "dailyEntries.$.waterVolume": data.waterVolume,
        "dailyEntries.$.time": data.time,
      },
    },
    { new: true }
  );
};

exports.remove = async (dayId, entryId) => {
  const day = await Water.findById(dayId);
  if (!day) throw HttpError(404, "Day entry does not exist");
  const entry = day.dailyEntries.find((i) => i._id.toString() === entryId);
  if (!entry) throw HttpError(404, "Entry not found");
  return Water.findByIdAndUpdate(
    dayId,
    {
      $inc: { totalVolume: -entry.waterVolume },
      $pull: { dailyEntries: { _id: entryId } },
    },
    { new: true }
  );
};

exports.getMonth = async (year, month, owner) => {
  const selectedDates = await Water.find({
      date: { $regex: `${month} ${year}` },
      owner,
  }).select(['date', 'waterRate', 'progress', 'dailyEntries']);
  if (!selectedDates) throw HttpError(404, "No entries for this month");
  return selectedDates;
};

exports.updateWaterRateByDate = (owner, userDate) => {
    const date = new Date();
    return Water.findOneAndUpdate(
        {
            date: userDate || `${date.getDate()} ${date.toLocaleString('en', {month: 'long'})} ${date.getFullYear()}`,
            owner,
        },
        { waterRate: owner.waterRate },
        { new: true }
    );
};

exports.updateWaterRateById = (owner, dayId) => {
    return Water.findByIdAndUpdate(
        dayId,
        { waterRate: owner.waterRate },
        { new: true }
    );
};

exports.checkById = (id) => {
  const idIsValid = Types.ObjectId.isValid(id);
  if (!idIsValid) throw HttpError(404, "Not valid id");
};
exports.checkIdByOwner = async (id, owner) => {
  const isDayEntryExist = await Water.exists({ _id: id, owner });
  if (!isDayEntryExist) throw HttpError(404, "Day entry does not exist");
};