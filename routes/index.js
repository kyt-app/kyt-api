const router = require('express').Router();

router.get('/', (_, res) => {
	res.send('hi');
});

module.exports = router;
