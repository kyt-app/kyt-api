const axios = require('axios');
const User = require('../models/User')

const commonWords = ["SARS COV", "SARS-COV", "Negative results", "patient history", 
                      "Positive results", "bacterial infection", "co-infection", "RNA",
                      "acute phase of infection", "viral load", "RNA specific",
                      "SARS-CoV", "RT - PCR","epidemiological information", 
                      "sole basis", "viruses", "test result", "possibility of Covid",
                      "fresh sample", "repeat sample", "Quality of sample",
                      "possibility of SARS", "insufficient RNA specific"]

async function analyzeText(req, res) {
    const { text, email, testName, timestamp, imageUrl } = req.body
    
    User.find({"email":email}, async (err, user) => {
      if (err) {
        console.log(err)
      }
      const first_name = user[0].name.split(' ')[0]
      let PIIcheck = null

      const document = {
        content: text,
        type: 'PLAIN_TEXT',
      };
      const postData = {
        "document": document,
        "encodingType": "UTF16"
      }
      const postConfig = {
        method: 'post',
        url: `https://language.googleapis.com/v1/documents:analyzeEntities?key=${process.env.GCNLP_API_KEY}`,
        headers: { 
          'Content-Type': 'application/json', 
        },
        data : postData
      };
      axios(postConfig)
          .then(function (result) {
            const entities = result.data.entities;
            const results = []
            const strippedResults = []
            entities.forEach(entity => {
              results.push(entity.name);
            });
            for (let i = 0; i < results.length; i++) {
              const strippedWord = results[i].split(' ')
              for(let j = 0; j < strippedWord.length; j++) {
                strippedResults.push(strippedWord[j].toLowerCase());
              }
            }
            if(strippedResults.includes(first_name.toLowerCase())) {
              PIIcheck = true;
            } else {
              PIIcheck = false;
            }
            console.log(PIIcheck)
            if(PIIcheck) {
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
                      "status": "",
                      "imageUrl": imageUrl
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
                        User.updateOne({ "email": email, "tests.testName": testName }, { $set: { "tests.$.status": testDetails.status, "tests.$.timestamp": testDetails.timestamp, "tests.$.imageUrl": testDetails.imageUrl } }, (err, response) => {
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
              } else {
                const testDetails = {
                  "testName": testName,
                  "timestamp": timestamp,
                  "status": "invalid",
                  "imageUrl": imageUrl
                }
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
              }
          })
          })
          .catch((err) => console.log(err))
}

module.exports = {
    analyzeText
}



