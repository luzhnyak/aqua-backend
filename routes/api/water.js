const express = require('express');
const {validateBody, authenticate, waterMiddleware, validateQuery} = require('../../middlewares');
const { waterSchema } = require('../../schemas');
const waterControllers = require('../../controllers/waterControllers');

const router = express.Router();

router.use(authenticate, waterMiddleware.updateWaterRate)

router.route('/')
.get(waterControllers.getCurrentDay)
.post(validateBody.checkCreate(waterSchema.addWater), waterControllers.add)

router.get('/month',validateQuery(waterSchema.query), waterControllers.getMonth);

router.route('/:dayId/:entryId')
  .all(waterMiddleware.checkDayEntryById)
  .put(validateBody.checkUpdate(waterSchema.addWater), waterControllers.update)
  .delete(waterControllers.remove);

module.exports = router;