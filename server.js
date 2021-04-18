// server.js
// External imports (see package.json)
require("dotenv").config();
const MongoAccessor = require('./mongo-accessor');

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require("express");
const app = express();

// our default array of docs
// const docs = [
//   "Find and count some sheep",
//   "Climb a really tall mountain",
//   "Wash the dishes"
// ];
const cluster = new MongoAccessor(process.env.DB_URI);


// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// https://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
});
app.get("/characters", (request, response) => {
  response.sendFile(__dirname + "/views/characters.html");
});

// send the array of docs to the webpage
app.get("/mongo/characters", async (request, response) => {
  await cluster.get_docs('Characters', 'Saltmarsh', request.query);
  console.group("cluster.data");
  console.log(cluster.data);
  console.groupEnd("cluster.data");
  response.json(cluster.docs);
});

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
