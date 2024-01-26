const express = require('express');
const {validateBody, authenticate} = require('../../middlewares');
const { waterSchema } = require('../../schemas');
const waterControllers = require('../../controllers/waterControllers');

const router = express.Router();

router.use(authenticate)

router.post('/', validateBody.checkCreate(waterSchema.addWater), waterControllers.add)

router.route('/:orderId')
  .put(validateBody.checkUpdate(waterSchema.updateEntry))
  .delete();

router.get('/:today');
router.get('/:month');

module.exports = router;