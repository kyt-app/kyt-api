const axios = require('axios');
const User = require('../models/User')

const commonWords = ["sars cov", "sars-cov", "negative results", "patient history", "positive results", "bacterial infection", 
                    "co-infection", "rna", "acute phase of infection", "viral load", "rna specific", "sars-cov", "rt - pcr", "epidemiological information", 
                    "sole basis", "viruses", "test result", "possibility of covid", "fresh sample", "repeat sample", "quality of sample", "possibility of sars", 
                    "insufficient rna specific", "pfizer", "covid", "covid-19", "cdc", "serum", "institute",
                     "covid19", "biontech", "covishield", "vaccine", "vaccination", "bharat", "biotech", "covaxin"]


async function analyzeText(req, res) {
    const { text, authToken, testName, timestamp, imageUrl } = req.body
    
    User.find({"authToken":authToken}, async (err, user) => {
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
                      if(commonWords.includes(keyPhrasesArray[i].toLowerCase())) {
                        commonWordsCount += 1
                      }
                    }
                    const testDetails = {
                      "testName": testName,
                      "timestamp": timestamp,
                      "status": "",
                      "imageUrl": imageUrl
                    }
                    if(commonWordsCount > 1) {
                      testDetails.status = "valid"
                    } else {
                      testDetails.status = "invalid"
                    }
                    User.find({ $and: [ { "tests.testName": testName }, { "authToken": authToken } ] }, (err, response) => {
                      if(err) {
                        console.log(err)
                      }
                      if(response.length == 0) {
                        User.findOneAndUpdate({"authToken":authToken}, { $push: { "tests": testDetails} },
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
                        User.updateOne({ "authToken": authToken, "tests.testName": testName }, { $set: { "tests.$.status": testDetails.status, "tests.$.timestamp": testDetails.timestamp, "tests.$.imageUrl": testDetails.imageUrl } }, (err, response) => {
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
                User.find({ $and: [ { "tests.testName": testName }, { "authToken": authToken } ] }, (err, response) => {
                  if(err) {
                    console.log(err)
                  }
                  if(response.length == 0) {
                    User.findOneAndUpdate({"authToken":authToken}, { $push: { "tests": testDetails} },
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
                    User.updateOne({ "authToken": authToken, "tests.testName": testName }, { $set: { "tests.$.status": testDetails.status, "tests.$.timestamp": testDetails.timestamp, "tests.$.imageUrl": testDetails.imageUrl } }, (err, response) => {
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
              }
          })
          })
          .catch((err) => console.log(err))
}

module.exports = {
    analyzeText
}



