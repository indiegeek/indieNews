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
const port = 4000;

//app functions

db.connect('./data', ['topics']);

//if the db is new, initialize it
if (!db.topics.find().length) {
    const initDB = {id: 1, category: "INIT", topic: "INIT", lang: "INIT"};
    db.topics.save(initDB)
    console.log("Database was empty, initalized.")
}

//loop through each topic and fetch the results (currently just writes out the calls to make)
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
    } else if(!req.body.category) {
        return res.status(400).send({
            success: 'false',
            message: 'category is required'
        });
      } 
      const newTopic = {
        id: db.topics.find().length+1,
        category: req.body.category,
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

let myTopics = db.topics.find().length;
console.log(myTopics)
for (let i = 2; i < myTopics; i++) {
    let getTopics = db.topics.find({id: i});
    for (let i2 = 0; i2 < getTopics.length; i2++) {
        console.log(getTopics[i2].topic)
    }
}

console.log(myTopics)
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