const express = require('express');
const router = express.Router();
const { auth } = require('../../middlewares/auth');
const { flagUser, flagMerchant } = require('./actions.controller');

router.post('/flag-user', auth, flagUser);
router.post('/flag-merchant', auth, flagMerchant);

module.exports = router;