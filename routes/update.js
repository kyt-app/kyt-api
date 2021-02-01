const router = require('express').Router();
const updateService = require('../services/update.service')

router.get('/status', (req, res) => {
	updateService.updateStatus(req, res)
});

module.exports = router;