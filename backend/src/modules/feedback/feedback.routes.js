const express = require('express');
const router = express.Router();
const { auth } = require('../../middlewares/auth');
const { submitFeedback, getFeedback } = require('./feedback.controller');

router.post('/', auth, submitFeedback);
router.get('/', auth, getFeedback);

module.exports = router;