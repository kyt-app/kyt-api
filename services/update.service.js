const User = require('../models/User')

function updateStatus(req, res) {
    User.find({"email": req.query.email}, (err, user) => {
        if(err) { 
            console.log(err) 
        }
        let response = ""
        for(let i=0; i < user[0].tests.length; i++) {
            var newDate = new Date(user[0].tests[i].timestamp).getTime(); 
            var currentDate = new Date().getTime();
            var diff = Math.round((((currentDate-newDate)/1000)/60)/60);
            if(diff >= 72) {
                response = "invalid"
            } else {
                response = "valid"
            }
            if(user[0].tests[i].status == "invalid") {
                response = "invalid"
            }
            User.updateOne({ "email": req.query.email, "tests.testName": user[0].tests[i].testName }, { $set: { "tests.$.status": response } }, (err, resp) => {
                if(err) {
                  console.log(err)
                }
            })
        }
        res.json({"message":"updated"})
    })
}

function updateProfile(req, res) {
    const { email, phoneNumber, pfpUrl } = req.body
    User.updateOne({"email": email}, { $set: { "phoneNumber": phoneNumber , "pfpUrl": pfpUrl }}, (err, response) => {
        if(err) {
            console.log(err)
        }
        res.send("profile updated")
    })
}   

module.exports = {
    updateStatus,
    updateProfile
}