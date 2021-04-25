// main.js Runs everything
const ZMAP = require('./services');
const app = new ZMAP("public");
app.routePage("/","/views/index.html");
app.routePage("/characters", "/views/characters.html");
app.routePage("/OAuth", "/views/OAuth.html");

app.get("/profile", (request, response) => {
  response.status(201).send('Profile request received.');  
})

app.get("/login", async (request, response, next) => {
      const data = await app.db.get_user(request.query.uid);
      const isSigned = await app.db.check_password(request.query.pw, data.signature, data.key); 
      if (isSigned) {
          console.log("Successfully logged in!");
          response.status(200).send('Sign-in successful!');
      } else {
          console.log("Failed login successfully!");
          response.status(401).send('Sign-in unsuccessful.');
      }
    })

// Now we handle the "Actions" requests, directing them to "actions" sub-path of "slack".
// This is essentially the same handling syntax as used for "Events"
app.post("/slack/actions", async (req, res) => {
  if (await !app.signature.validate(req, res)) {
    // Sends status messages back immediately
    console.warn("Invalid signature.");
    return;
  }
  const ts = req.headers["x-slack-request-timestamp"];
  const { type, trigger_id, user, actions, view } = JSON.parse(
    req.body.payload
  );
  app.logs.action(new Date(ts), type, trigger_id, user, actions ? actions : view);
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
//                app.logs.response(
//                  resp,
//                  "appHomeServices.openModal (add_ click: success)"
//                )
//              )
//              .catch(err =>
//                app.logs.caught_error(
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
//          app.logs.response(
//            resp,
//            "appHomeServices.displayHome (view_submission == success)"
//          )
//        )
//        .catch(err =>
//          app.logs.caught_error(
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
  if (await !app.signature.validate(req, res)) {
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
  await app.db.get_docs('Characters', 'Saltmarsh', request.query);
  response.json(app.db.session.data);
});

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + process.env.PORT);
});