const axios = require('axios');
const env = require('dotenv').config();

let apiKey = process.env.APIKEY

var topics = ["puppies", "kittens", "fish", "chickens", "horses", "cows"]

for (let i = 0; i < topics.length; i++) {
    let currentTopic = topics[i]
    console.log(currentTopic)
    let makeCalls = `options = {
        method: 'GET',
        url: 'https://api.newscatcherapi.com/v2/search',
        params: {q: '${ currentTopic }', lang: 'en', sort_by: 'relevancy', page: '1'},
        headers: {
            'x-api-key': ${ apiKey } 
        };`
        console.log(makeCalls);
        }    

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