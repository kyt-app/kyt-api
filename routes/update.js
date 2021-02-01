const router = require('express').Router();
const updateService = require('../services/update.service')

router.get('/status', (req, res) => {
	updateService.updateStatus(req, res)
});

router.post('/profile', (req, res) => {
	updateService.updateProfile(req, res)
});

module.exports = router;