// server.js
// External imports (see package.json)
const { server } = require('./services');

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require("express");
const app = express();

const cors = require("cors"); // See: https://expressjs.com/en/resources/middleware/cors.html   Cross-origin resources configuration
const bodyParser = require("body-parser"); // See: https://www.npmjs.com/package/body-parser          Parses HTTP transaction body text prior to other handling
const my = require("./private/axios-config.js"); // Configured AXIOS defaults
const qs = require("qs");

// Handle verification of signature from Slack SECRET
const signature = require("./private/authenticate");

// Handle server message-passing and data storage
const { myDatabase } = require("./private/database");

// Make console debugging easier  (maybe):
const logs = require("./private/debug-console");

// Main services that have core functionality in this application:
// const appHomeServices = require("./private/home-tab"); // Handle deployment of application home page

// DiceRoller class object that handles rolling dice
const DiceRoller = require("./private/DiceRoller");
const dice = new DiceRoller();

// SaltBlock class object that handles voting on coffee etc.
const MessageBlock = require("./private/MessageBlock");
const actionBlock = new MessageBlock();
const current_user = {
  id: "none",
  username: "none",
  name: "none"
};


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
  const data = await server.get_user(request.query.uid);
  const isSigned = await server.check_password(request.query.pw, data.signature, data.key); 
  if (isSigned) {
    response.status(200).send('Sign-in successful!');
  } else {
    response.status(401).send('Sign-in unsuccessful.');
  }
})

// Now we handle the "Actions" requests, directing them to "actions" sub-path of "slack".
// This is essentially the same handling syntax as used for "Events"
app.post("/slack/actions", async (req, res) => {
  if (await !signature.validate(req, res)) {
    // Sends status messages back immediately
    console.warn("Invalid signature.");
    return;
  }
  const ts = req.headers["x-slack-request-timestamp"];
  const { type, trigger_id, user, actions, view } = JSON.parse(
    req.body.payload
  );
  logs.action(new Date(ts), type, trigger_id, user, actions ? actions : view);
  switch (type) {
    case "block_actions": {
      actions.forEach(async a => {
        switch (
          a.action_id // instead of actions[0].action_id, this accounts for all actions in array
        ) {
          case "add_note": {
//            // User clicked the "+" button to add a note --
//            appHomeServices
//              .openModal(trigger_id)
//              .then(resp =>
//                logs.response(
//                  resp,
//                  "appHomeServices.openModal (add_ click: success)"
//                )
//              )
//              .catch(err =>
//                logs.caught_error(
//                  err,
//                  "appHomeServices.openModal (add_ click: error)"
//                )
//              );
//            break;
          } // End case "add_note"
          case "button-action-end": {
            actionBlock.end_session();
            break;
          } // -- End case "button-action-end"
          case "button-action-jitsi": {
            await get_user_data(user.id, user.name);
            let text =
              current_user.name +
              " has joined the Jitsi room (" +
              actionBlock.url.jitsi.variable +
              ")";
            actionBlock.send_message(text);
            break;
          } // -- End case "button-action-jitsi"
          case "button-action-schmeppy": {
            await get_user_data(user.id, user.name);
            let text =
              current_user.name +
              " has joined the Schmeppy game (" +
              actionBlock.url.schmeppy.variable +
              ")";
            actionBlock.send_message(text);
            break;
          } // -- End case "button-action-jitsi"
          case "vote": {
            // User voted on one of the options from Blocks in chat caused by /coffee Slash command --
            // console.log("actionBlock: ", actionBlock);
            await actionBlock.vote_incrementer_callback(actions[0].value);
            break;
          } // -- End case "vote"
        }
      });
      break;
    } // End Case "block actions"
    case "view_submission": {
//      // Modal form submission --
//      await appHomeServices
//        .displayHome(req)
//        .then(resp =>
//          logs.response(
//            resp,
//            "appHomeServices.displayHome (view_submission == success)"
//          )
//        )
//        .catch(err =>
//          logs.caught_error(
//            err,
//            "appHomeServices.displayHome (view_submission == error)"
//          )
//        );

      break;
    } // -- End case "view_submission"
  }
});

// Last we handle the "coffee" slash command.
// This should essentially always just do the same thing so there is no case-handling.
app.post("/slack/commands", async (req, res) => {
  if (await !signature.validate(req, res)) {
    // Sends status messages back immediately
    console.warn("Invalid signature.");
    return;
  }
  console.log("Slash command: " + req.body.command + " detected.");
  switch (req.body.command) {
    case "/convene": {
      await get_user_data(req.body.user_id, req.body.user_name);
      actionBlock.start_session(
        current_user,
        req.body.channel_id,
        req.body.text
      );
      break;
    } // end case "convene"
    case "/roll": {
      await get_user_data(req.body.user_id, req.body.user_name);
      let result = dice.parse(req.body.text, current_user.name);
      let msg = current_user.name + " rolled " + String(result);
      // console.log(msg);
      // actionBlock.send_message(JSON.stringify(result));
      actionBlock.send_message(msg);
      break;
    } // end case "convene"
  }
});

app.post("/user/login", async (req, res) => {
  res.status(201).send('Login request received'); // Send "Create" message.
  console.log(req.body)
  await myDatabase.get_docs("User", "Identity", {"uid": req.body.uname}, (result) => {
    myDatabase.check_password(req.body.pw, result[0].signature, result[0].key, async (isSigned) => {
      if (isSigned) {
        await res.status(202).sendFile("https://zmap.nhp.pw/profile/user")
      };
    })
  })
})

// Handle OAuth
app.get("/slack/OAuth", async (req, res) => {
  res.send(
    'Please wait, redirecting...'
  );
});


// send the array of docs to the webpage
app.get("/mongo/characters", async (request, response) => {
  console.log(request.query);
  await server.get_docs('Characters', 'Saltmarsh', request.query);
  response.json(server.session.data);
});

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + process.env.PORT);
});