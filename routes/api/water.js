const express = require('express');
const {validateBody, authenticate, waterMiddleware} = require('../../middlewares');
const { waterSchema } = require('../../schemas');
const waterControllers = require('../../controllers/waterControllers');

const router = express.Router();

router.use(authenticate)

router.post('/', validateBody.checkCreate(waterSchema.addWater), waterControllers.add)
router.get('/:dayId');
router.get('/:month');

router.route('/:dayId/:entryId')
  .all(waterMiddleware.checkDayEntryById)
  .put(validateBody.checkUpdate(waterSchema.addWater))
  .delete(waterControllers.remove);


module.exports = router;