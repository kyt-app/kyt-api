const router = require('express').Router();
const profileService = require('../services/profile.service')

router.get('/', (req, res) => {
	profileService.getProfile(req, res)
});

router.get('/validate', (req, res) => {
	profileService.validateProfile(req, res);
});

module.exports = router;
