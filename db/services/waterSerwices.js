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