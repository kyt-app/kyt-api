const User = require('../models/User')

function getProfile(req, res) {
    User.find({"email":req.query.email}, (err, user) => {
        if(err) { 
            console.log(err) 
        }
        const response = {
            "name": user[0].name,
            "pfp": "https://i.imgur.com/twPSMdV.jpg",
            "tests": user[0].tests
        }
        res.json(response)
    })
}

module.exports = {
    getProfile
}