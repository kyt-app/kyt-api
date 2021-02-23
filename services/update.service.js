const axios = require('axios');
const User = require('../models/User')

function updateStatus(req, res) {
    User.find({"authToken": req.query.authToken}, (err, user) => {
        if(err) { 
            console.log(err) 
        }
        let response = ""
        let archived = false
        for(let i=0; i < user[0].tests.length; i++) {
            if(!user[0].tests[i].testName.includes("vaccine")) {
                var newDate = new Date(user[0].tests[i].timestamp).getTime(); 
                var currentDate = new Date().getTime();
                var diff = Math.round((((currentDate-newDate)/1000)/60)/60);
                if(diff >= 72) {
                    response = "invalid"
                    archived = true
                } else {
                    response = "valid"
                    archived = false
                }
                if(user[0].tests[i].status == "invalid") {
                    response = "invalid"
                }
                User.updateOne({ "authToken": req.query.authToken, "tests.testName": user[0].tests[i].testName }, { $set: { "tests.$.status": response, "tests.$.archived": archived  } }, (err, resp) => {
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
    const data = {
        "url": pfpUrl
    }
    const config = {
        method: 'post',
        url: 'https://kyt-face-api.cognitiveservices.azure.com/face/v1.0/detect?returnFaceId=true&detectionModel=detection_02',
        headers: { 
            'Content-Type': 'application/json',
            'Ocp-Apim-Subscription-Key': process.env.AZURE_FACE_API_KEY 
        },
        data : data
    };
    axios(config)
        .then(function (response) {
            if (response.data.length == 0) {
                res.send("invalid picture")
            } else {
                User.updateOne({"authToken": authToken}, { $set: { "phoneNumber": phoneNumber , "pfpUrl": pfpUrl }}, (err, response) => {
                    if(err) {
                        console.log(err)
                    }
                    res.send("profile updated")
                })
            }
        })
        .catch(function (error) {
            console.log(error)
        });
}   

module.exports = {
    updateStatus,
    updateProfile
}