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

function validateProfile(req, res) {
    const kytNumber = req.query.kytNumber;
    var goodToGo = false;
    let message;

    User.findOne({ 'kytNumber': kytNumber }).then(user => {
        if (!user) {
            return res.json({
                "safeToTravel": null,
                "message": "404: No user matched with the specified KYT number."
            });

        } else {
            const testHistory = user.tests;
            const currentDate = new Date().getTime();
    
            for (let i = 0; i < testHistory.length; i++) {
                const testDate = new Date(testHistory[i].timestamp).getTime();
                const timeSinceTest = Math.round((((currentDate - testDate)/1000)/60)/60);
    
                if (timeSinceTest >= 72) {
                    var goodToGo = false;
                } else {
                    var goodToGo = testHistory[i].status == 'valid' ? true : false;
                    break;
                }
            }
    
            message = goodToGo
                ? 'GOOD TO GO: This person has a valid COVID-19 test result and/or has taken the COVID-19 vaccine.'
                : 'INELIGIBLE: This person\'s COVID-19 tests have expired or are invalid.';
    
            return res.json({
                "safeToTravel": goodToGo,
                "message": message
            });
        }
    }).catch(err => console.log(err));
}

module.exports = {
    getProfile,
    validateProfile
}