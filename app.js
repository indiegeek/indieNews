//required packages, axios for api calling, env for .env vars, express to serve content
const axios = require('axios');
const env = require('dotenv').config();
const express = require('express');
const db = require('diskdb');
const bodyParser = require('body-parser')
//app vars
const server = express();
let apiKey = process.env.APIKEY //up to 10,000 calls/day for 90 days
let lang = "en";
let sort = "relevancy";
let page = 1;
var topics = ["puppies", "kittens", "fish", "chickens", "horses", "cows"] //topics to fetch content on, will move these externally eventually
const port = 4000;

//app functions

db.connect('./data', ['topics']);

//if the db is new, initialize it
if (!db.topics.find().length) {
    const initDB = {id: "INIT", topic: "INIT", lang: "INIT"};
    db.topics.save(initDB)
}

//loop through each topic and fetch the results (currently just writes out the calls to make)
for (let i = 0; i < topics.length; i++) {
    let currentTopic = topics[i]
    // console.log(currentTopic)
    let makeCalls = `options = {
        method: 'GET',
        url: 'https://api.newscatcherapi.com/v2/search',
        params: {q: '${ currentTopic }', lang: '${ lang }', sort_by: '${ sort }', page: '${ page }'},
        headers: {
            'x-api-key': ${ apiKey } 
        };`
        // console.log(makeCalls);
        }    
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({extended: false}))
server.get("/", (req, res) => {
    res.sendFile(__dirname + '/html/index.html');
});
server.listen(port, () => {
    console.log(`Server listening at ${port}`);
});
server.post("/api/v1/addNewTopic", (req, res) => {
    if(!req.body.topic) {
        return res.status(400).send({
          success: 'false',
          message: 'topic is required'
        });
      } else if(!req.body.lang) {
        return res.status(400).send({
          success: 'false',
          message: 'lang is required'
        });
      } 
      const newTopic = {
        id: db.topics.find().length+1,
        topic: req.body.topic,
        lang: req.body.lang
      }
      db.topics.save(newTopic);
      return res.status(200).send({
        success: true,
        message: "Topic added successfully",
        newTopic
      })
})
// var options = {
//   method: 'GET',
//   url: 'https://api.newscatcherapi.com/v2/search',
//   params: {q: 'Bitcoin', lang: 'en', sort_by: 'relevancy', page: '1'},
//   headers: {
//     'x-api-key': apiKey
//   }
// };
// }

// var options = {
//   method: 'GET',
//   url: 'https://api.newscatcherapi.com/v2/search',
//   params: {q: 'Bitcoin', lang: 'en', sort_by: 'relevancy', page: '1'},
//   headers: {
//     'x-api-key': apiKey
//   }
// };

// axios.request(options).then(function (response) {
// 	console.log(response.data.articles[0].title);
// }).catch(function (error) {
// 	console.error(error);
// });