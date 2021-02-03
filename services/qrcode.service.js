const User = require('../models/User')

function getQRcode(req, res) {
    User.find({"email":req.query.email}, (err, user) => {
        if(err) { 
            console.log(err) 
        }
        const url = "https://kyt-api.azurewebsites.net/qrcode/" + user[0].kytNumber
        res.json({url})
    })
}

function renderTemplate(req, res) {
    User.find({"kytNumber":req.params.kytNumber}, (err, user) => {
        if(err) { 
            console.log(err) 
        }
        const context = {
            "name": user[0].name,
            "pfp": user[0].pfpUrl,
            "tests": user[0].tests
        }
        res.render('profile', context)
    })
}

module.exports = {
    getQRcode,
    renderTemplate
}