const router = require('express').Router();
const qrcodeService = require('../services/qrcode.service')

router.get('/', (req, res) => {
	qrcodeService.getQRcode(req, res)
});

router.get('/:kytNumber', (req, res) => {
	qrcodeService.renderTemplate(req, res)
});

module.exports = router;