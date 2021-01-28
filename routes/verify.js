const router = require('express').Router();
const verifyService = require('../services/verify.service')

router.post('/', async (req, res) => {
	verifyService.analyzeText(req, res)
});

module.exports = router;
