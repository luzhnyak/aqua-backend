const { waterServices } = require("../db/services");
const { ctrlWrapper } = require("../helpers");

exports.checkDayEntryById = ctrlWrapper(async (req, res, next) => {
    await waterServices.checkById(req.params.dayId);
    await waterServices.checkById(req.params.entryId);
    await waterServices.checkIdByOwner(req.params.dayId, req.user)
    next()
})