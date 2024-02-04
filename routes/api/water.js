const express = require('express');
const {validateBody, authenticate, waterMiddleware, validateQuery, validateParams} = require('../../middlewares');
const { waterSchema } = require('../../schemas');
const waterControllers = require('../../controllers/waterControllers');

const router = express.Router();

router.use(authenticate, )

router.post(
    '/',
    waterMiddleware.updateWaterRate,
    validateBody.checkCreate(waterSchema.addWater),
    waterControllers.add
);

router.get(
    '/month',
    waterMiddleware.updateWaterRate,
    validateQuery(waterSchema.query),
    waterControllers.getMonth
);

router.get(
    '/:date',
    waterMiddleware.updateWaterRate,
    validateParams(waterSchema.getDay),
    waterControllers.getCurrentDay
);

router
    .route('/:dayId/:entryId')
    .all(waterMiddleware.checkDayEntryById, waterMiddleware.updateWaterRate)
    .put(validateBody.checkUpdate(waterSchema.update), waterControllers.update)
    .delete(waterControllers.remove);

module.exports = router;