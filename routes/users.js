const router = require('express').Router();
const userService = require('../services/user.service')

router.get('/', (req, res) => {
	userService.getUsers(req, res)
})

router.post('/register',(req, res) => {
	userService.postUser(req, res)
})

router.get('/register/checkpassport',(req, res) => {
	userService.checkPassport(req, res)
})

module.exports = router;