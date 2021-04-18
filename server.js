// server.js
// where your node app starts

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
const cluster = MongoAccessor();


// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// https://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
});

// send the default array of docs to the webpage
app.get("/docs", async (request, response) => {
  await cluster.get_docs('Characters','Saltmarsh',{"type": "pc"})
  // express helps us take JS objects and send them as JSON
  response.json(cluster.docs);
});

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
