//required packages, axios for api calling, env for .env vars, express to serve content
const axios = require('axios');
const env = require('dotenv').config();
const db = require('diskdb');
const bodyParser = require('body-parser');
const express = require('express');
const { RateLimit }  = require('async-sema')

//app vars
const server = express();
let apiKey = process.env.APIKEY //up to 10,000 calls/day for 90 days
const port = 4000;
const apiLimit = RateLimit(1);
//app functions
const createURLs = function createURLs(fetchTopic,sLang,sSort,iPage) {
    const url = ('https://api.newscatcherapi.com/v2/search?' 
        + new URLSearchParams({q: fetchTopic}).toString() + "&" 
        + new URLSearchParams({lang: sLang}).toString() + "&" 
        + new URLSearchParams({sort_by: sSort}).toString() + "&" 
        + new URLSearchParams({page: iPage}).toString());
    return url; 
}

//fetch with fetch
const fetchNews = async function fetchNews(url) {
    // console.log(url)
    let response = await fetch(url, {
        method: "GET",
        // mode: "cors",
        // cache: "no-cache",
        credentials: "include",
        headers: {
            'x-api-key': apiKey
        }
    })
    let myResponse = await response.json();
    return myResponse;
};

const thisNewsFetch = async function thisNewsFetch(thisNews) {
    let getTopics = {"topics": "",
                    "lang": "",
                    "sort": "relevancy",
                    "page": 1
                    };
    let nTopics = db.topics.find().length;
    for (let i = 2; i <= nTopics; i++) {
        let myTopic = db.topics.find({id: i});
        getTopics.topics = myTopic[0].topic + " " + myTopic[0].category
        getTopics.lang = myTopic[0].lang
        let thisURL = await createURLs(getTopics.topics, getTopics.lang, getTopics.sort, getTopics.page)
        await apiLimit()
        let thisNews = await fetchNews(thisURL)
        return thisNews
};
};

const writeNewsDB = async function writeNewsDB() {
    let newsRes = await thisNewsFetch()
    for (let a = 0; a <= newsRes.articles.length-1; a++) {
        let newsResDB = {id: db.news.find().length+1,
                         myTopic: "FILL IN LATER",
                         title: newsRes.articles[a].title,
                         author: newsRes.articles[a].author,
                         publishedDate: newsRes.articles[a].published_date,
                         excerpt: newsRes.articles[a].excerpt,
                         summary: newsRes.articles[a].summary,
                         media: newsRes.articles[a].media,
                         link: newsRes.articles[a].link,
                         media: newsRes.articles[a].media,
                         topic: newsRes.articles[a].topic,
                         country: newsRes.articles[a].country
                        }
        db.news.save(newsResDB)
    }
}

db.connect('./data', ['topics']);
db.connect('./data', ['news']);

//if the db is new, initialize it
if (!db.topics.find().length) {
    const initDB = {id: 0, category: "INIT", topic: "INIT", lang: "INIT"};
    db.topics.save(initDB)
    console.log("Database was empty, initalized.")
}
if (!db.news.find().length) {
    const initDB = {id: 0, myTopic: "", title: "", author: "", publishedDate: "", excerpt: "", summary: "", media: "", link:"", media: "", topic:"", country:""};
    db.news.save(initDB)
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

writeNewsDB()