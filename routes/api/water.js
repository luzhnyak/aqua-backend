const express = require('express');

const router = express.Router();

router.route('/')
  .post()
  .put()
  .delete();

router.get('/:today');
router.get('/:month');

module.exports = router;
