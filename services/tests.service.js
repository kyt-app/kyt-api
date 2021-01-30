const { response } = require('express')
const User = require('../models/User')

function getTestDetails(req, res) {
    const { email, testName } = req.query
    User.findOne({"email":email}, (err, user) => {
        if(err) {
            console.log(err)
        }
        const testsArray = user.tests
        console.log(testsArray)
        for (let i=0; i < testsArray.length;i++) {
            if(testsArray[i].testName == testName) {
                res.json(testsArray[i])
            } 
        }
    })
}

function deleteTest(req, res) {
    const { email, testName } = req.body
    User.updateOne({"email": email}, { $pull: { "tests": { "testName": testName } } }, (err, response) => {
        if(err) {
            console.log(err)
        }
        res.send("deleted successfully")
    })
}

module.exports = {
    getTestDetails,
    deleteTest
}