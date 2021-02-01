const User = require('../models/User')

function getProfile(req, res) {
    User.find({"email":req.query.email}, (err, user) => {
        if(err) { 
            console.log(err) 
        }
        const response = {
            "name": user[0].name,
            "pfp": user[0].pfpUrl,
            "tests": user[0].tests
        }
        res.json(response)
    })
}

module.exports = {
    getProfile
}