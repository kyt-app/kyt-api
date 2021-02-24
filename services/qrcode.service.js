const User = require('../models/User')

function getQRcode(req, res) {
    User.find({"authToken":req.query.authToken}, (err, user) => {
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
        const tests = user[0].tests
        const updatedTests = []
        for(let i = 0; i < tests.length; i++) {
            if(tests[i].archived == false) {
                updatedTests.push(tests[i])
            }
        } 
        const context = {
            "name": user[0].name,
            "pfp": user[0].pfpUrl,
            "tests": updatedTests
        }
        res.render('profile', context)
    })
}

module.exports = {
    getQRcode,
    renderTemplate
}