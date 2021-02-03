const router = require('express').Router();

router.get('/', (req, res) => {
	res.send('Intermediary API for the Know Your Traveller mobile app.');
});

module.exports = router;
