const { waterServices } = require("../db/services");
const { ctrlWrapper } = require("../helpers");

exports.checkDayEntryById = ctrlWrapper(async (req, res, next) => {
    waterServices.checkById(req.params.dayId);
    waterServices.checkById(req.params.entryId);
    await waterServices.checkIdByOwner(req.params.dayId, req.user)
    next()
})

exports.updateWaterRate = ctrlWrapper(async (req, res, next) => {
    const { date, dayId } = req.params;
    if (req.body.date) {
        await waterServices.updateWaterRateByDate(req.user, req.body.date)
        return next()
    }
    if (date) {
        await waterServices.updateWaterRateByDate(req.user, date.replaceAll('-', ' '))
        return next()        
    }
    if (dayId) {
        await waterServices.updateWaterRateById(req.user, dayId)
        return next()
    }
    await waterServices.updateWaterRateByDate(req.user)
    next()
})