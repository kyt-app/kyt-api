const User = require('../models/User')

function updateStatus(req, res) {
    User.find({"authToken": req.query.authToken}, (err, user) => {
        if(err) { 
            console.log(err) 
        }
        let response = ""
        for(let i=0; i < user[0].tests.length; i++) {
            if(!user[0].tests[i].testName.includes("vaccine")) {
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
                User.updateOne({ "authToken": req.query.authToken, "tests.testName": user[0].tests[i].testName }, { $set: { "tests.$.status": response } }, (err, resp) => {
                    if(err) {
                        console.log(err)
                    }
                })
            }
        }
        res.json({"message":"updated"})
    })
}

function updateProfile(req, res) {
    const { authToken, phoneNumber, pfpUrl } = req.body
    User.updateOne({"authToken": authToken}, { $set: { "phoneNumber": phoneNumber , "pfpUrl": pfpUrl }}, (err, response) => {
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