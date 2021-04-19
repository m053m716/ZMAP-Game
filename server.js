// server.js
// External imports (see package.json)
const { server } = require('./services');

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require("express");
const app = express();

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

app.get("/profile", (request, response) => {
  response.status(201).send('Profile request received.');  
})

app.get("/login", async (request, response) => {
  const data = await server.get_user(request.data.uname);
  server.check_password(request.data.pw, data.signature, data.key, 
                        response.status(200).send, 
                        response.status(401).send);
})

// send the array of docs to the webpage
app.get("/mongo/characters", async (request, response) => {
  console.log(request.query);
  await server.get_docs('Characters', 'Saltmarsh', request.query);
  response.json(server.session.data);
});

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
