const { Types } = require("mongoose");
const { HttpError } = require("../../helpers");
const { Water } = require("../models/water")

exports.add = async (data, owner) => {
    const date = new Date();
    const waterList = await Water.findOne({
        date: { $gte: new Date(date.getFullYear(), date.getMonth(), date.getDate()) }, owner
    });
    if (waterList) {
        return Water.findByIdAndUpdate(waterList._id, {
            $inc: { totalVolume: +data.waterVolume },
            $push: { dailyEntries: data },
        }, {new: true});
    }
    return Water.create({
        date: Date.now(),
        waterRate: owner.waterRate,
        totalVolume: data.waterVolume,
        dailyEntries: [data] ,
        owner,
    });
}

exports.remove = async (dayId, entryId, owner) => {
    const day = await Water.findOne({ _id: dayId, owner })
    if (!day) throw HttpError(404, 'Not entry of day')
    const entry = day.dailyEntries.find(i => i._id.toString() === entryId);
    return Water.findByIdAndUpdate(
        dayId,
        {
            $inc: { totalVolume: -entry.waterVolume },
            $pull: { dailyEntries: { _id: entryId } },
        },
        { new: true }
    );
}

exports.checkById = async (id, owner) => {
        const idIsValid = Types.ObjectId.isValid(id);
    if (!idIsValid) throw HttpError(404, 'Not valid id');
    const isDayEntryExist = await Water.exists({ _id: id, owner })
    if (!isDayEntryExist) throw HttpError(404, 'Not day entry exist')
}