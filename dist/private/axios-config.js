// Make global configurations for axios
const axios = require("axios").default; // See: https://www.npmjs.com/package/axios         "Promise"-based HTTP client for handling asynchronous events
axios.defaults.baseURL = process.env.API_URL;
axios.defaults.headers.common['Authorization'] = 'Bearer ' + process.env.SLACK_BOT_TOKEN;
axios.defaults.headers.common['Accept'] = 'application/json, application/x-www-form-urlencoded, text/plain';
axios.defaults.headers.common['Content-Type'] = 'application/x-www-form-urlencoded; utf-8';
// axios.defaults.headers.common['Content-Type'] = 'application/json; utf-8';
axios.defaults.timeout = 6000; // Wait 6 seconds before timing out
module.exports = { axios };