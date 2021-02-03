const router = require('express').Router();
const testsService = require('../services/tests.service')

router.get('/testdetails', (req, res) => {
	testsService.getTestDetails(req, res)
});

router.get('/checktestname', (req, res) => {
	testsService.checkTestName(req, res)
});

router.post('/deletetest', (req, res) => {
	testsService.deleteTest(req, res)
})

module.exports = router;
