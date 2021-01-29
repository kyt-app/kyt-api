const router = require('express').Router();
const profileService = require('../services/profile.service')

router.get('/', (req, res) => {
	profileService.getProfile(req, res)
});

module.exports = router;
