const { response } = require('express')
const User = require('../models/User')

function getTestDetails(req, res) {
    const { authToken, testName } = req.query
    User.findOne({"authToken":authToken}, (err, user) => {
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

function checkTestName(req, res) {
    const { authToken, testName } = req.query
    User.find({ $and: [ { "tests.testName": testName }, { "authToken": authToken } ] }, (err, response) => {
        if(err) {
            console.log(err)
        }
        if(response.length == 0) {
            res.send({"boolean":false})
        } else {
            res.send({"boolean":true})
        }
    })
}

function deleteTest(req, res) {
    const { authToken, testName } = req.body
    User.updateOne({"authToken": authToken}, { $pull: { "tests": { "testName": testName } } }, (err, response) => {
        if(err) {
            console.log(err)
        }
        res.send("deleted successfully")
    })
}

module.exports = {
    getTestDetails,
    checkTestName,
    deleteTest
}