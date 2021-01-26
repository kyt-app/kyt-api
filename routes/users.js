const router = require('express').Router();
const userService = require('../services/user.service')

router.get('/', (req, res) => {
	userService.getUsers(req, res)
})

router.post('/',(req, res) => {
	userService.postUser(req, res)
})

module.exports = router;