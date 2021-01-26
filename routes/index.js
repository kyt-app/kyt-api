const router = require('express').Router();

router.get('/', (_, res) => {
	res.send('woah there');
});

module.exports = router;
