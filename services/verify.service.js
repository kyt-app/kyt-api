const axios = require('axios');
const User = require('../models/User')

const commonWords = ["SARS COV", "SARS-COV", "Negative results", "patient history", 
                      "Positive results", "bacterial infection", "co-infection", "RNA",
                      "acute phase of infection", "viral load", "RNA specific",
                      "SARS-CoV", "RT - PCR","epidemiological information", 
                      "sole basis", "viruses", "test result", "possibility of Covid",
                      "fresh sample", "repeat sample", "Quality of sample",
                      "possibility of SARS", "insufficient RNA specific"]

function analyzeText(req, res) {
    const { text, email, testName, timestamp } = req.body
    
    const data = {
        "documents": [
          {
            "language": "en",
            "id": "1",
            "text": text
          }
        ]
    }
    
    const config = {
      method: 'post',
      url: 'https://kyt-nlp.cognitiveservices.azure.com/text/analytics/v2.1/keyPhrases',
      headers: { 
        'Content-Type': 'application/json', 
        'Ocp-Apim-Subscription-Key': process.env.AZURE_API_KEY
      },
      data : data
    };
    
    axios(config)
    .then(function (response) {
        const keyPhrasesArray = response.data.documents[0].keyPhrases
        let commonWordsCount = 0
        for (let i=0;i<keyPhrasesArray.length;i++) {
          if(commonWords.includes(keyPhrasesArray[i])) {
            commonWordsCount += 1
          }
        }
        const testDetails = {
          "testName": testName,
          "timestamp": timestamp,
          "status": ""
        }
        if(commonWordsCount > 2) {
          testDetails.status = "valid"
        } else {
          testDetails.status = "invalid"
        }
        User.find({ $and: [ { "tests.testName": testName }, { "email": email } ] }, (err, response) => {
          if(err) {
            console.log(err)
          }
          if(response.length == 0) {
            User.findOneAndUpdate({"email":email}, { $push: { "tests": testDetails} },
                (err, succ) => {
                  if(err) {
                    console.log(err)
                  } else {
                    if(testDetails.status == "valid") {
                      res.json({
                        "boolean": true,
                        "message": "valid report"
                      });
                    } else {
                      res.json({
                        "boolean": false,
                        "message": "invalid report"
                      })
                    }
                  }
                }
              ,{ useFindAndModify: false })
          } else {
            User.updateOne({ "email": email, "tests.testName": testName }, { $set: { "tests.$.status": testDetails.status, "tests.$.timestamp": testDetails.timestamp } }, (err, response) => {
              if(err) {
                console.log(err)
              }
              if(testDetails.status == "valid") {
                res.json({
                  "boolean": true,
                  "message": "valid report"
                });
              } else {
                res.json({
                  "boolean": false,
                  "message": "invalid report"
                })
              }
            })
          }
        })
        
    })
    .catch(function (error) {
        console.log(error);
    });

}

module.exports = {
    analyzeText
}



