const router = require('express').Router();

router.get('/', (req, res) => {
	res.send('woah there');
});

module.exports = router;
