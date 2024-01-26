const express = require('express');
const {validateBody} = require('../../middlewares');
const { waterSchema } = require('../../schemas');

const router = express.Router();

router.post('/', validateBody.checkCreate(waterSchema.addWater))
router.route('/:orderId')
  .put(validateBody.checkUpdate(waterSchema.updateEntry))
  .delete();

router.get('/:today');
router.get('/:month');

module.exports = router;
