//// This file contains function exports for interacting with the `Coffee Break` application homepage
//// External dependencies
//const my = require("./axios-config");
//const qs = require("qs");
//
//// Internal dependencies
//const logs = require("./debug-console");
//
//// -- Home View - Use Block Kit Builder to compose.
//// --> https://api.slack.com/tools/block-kit-builder
//const updateView = user => {
//  // const header = new HeaderBlock(user); // -- Intro message --
//  // const blocks = header.blocks();
//  let newData = []; // -- Append new blocks to array after Intro --
//  try {
//    const rawData = db.getData(`/${user}/data/`);
//    // console.log("rawData: ", rawData);
//    newData = rawData.slice().reverse(); // Reverse to make the latest first
//    newData = newData.slice(0, 20); // Just display 20. BlockKit display has limit of 100 blocks for reference.
//    // console.log("newData: ", newData);
//  } catch (error) {
//    logs.def_error(error, "Error handling notes.json logs");
//    return {
//      type: "home",
//      title: {
//        type: "plain_text",
//        text: "Keep notes!"
//      },
//      blocks: blocks
//    };
//  }
//
//  // console.log('newData: ', newData);
//  if (newData) {
//    newData.forEach( (o) => {
//      let nb = new StickyBlock(o.note,o.color,o.timestamp);
//      let id = '_' + Math.random().toString(36).substr(2,9);
//      // console.log("nb.blocks: ", nb.blocks);
//      var cp = nb.blocks.slice();
//      cp.forEach((b, iB) => {
//        b.block_id = id + "-" + iB;
//        blocks.push({...b}); // ALl the blocks should be in one big array. 
//      });
//    });
//  } else {
//    blocks.push(new StickyBlock());
//  }
//
//  // The final view - (do not return stringify version, only do that in `args` step just before sending)
//  const view = {
//    type: "home",
//    title: {
//      type: "plain_text",
//      text: "Keep Notes"
//    },
//    blocks: blocks
//  };
//  return view
//};
//
///* Display App Home */
//const displayHome = async (req) => {
//  const submitted = new Note(req);
//  const note = submitted.note();
//  if (note.data) { 
//    db.push(`/${note.user}/data[]`, note.data, true) 
//  }
//
//  const args = {
//    token: process.env.SLACK_BOT_TOKEN,
//    user_id: note.user,
//    hash: submitted.hash, 
//    view: JSON.stringify(updateView(note.user)),
//    view_id: submitted.home_id
//  };
//  // console.log(submitted);
//  // After payload request from Slack API SERVER, this is response (first response from APP on User opening App Home)
//  const p = my.axios.post("/views.publish", qs.stringify(args))
//    .then()
//  return p
//};
//
//// Open a modal
//const openModal = async (trigger_id) => {
//  const modal = new ModalBlock();
//  const args = {
//    token: process.env.SLACK_BOT_TOKEN, 
//    trigger_id: trigger_id,
//    view: JSON.stringify(modal.view)
//  };
//  const result = await my.axios.post("/views.open", qs.stringify(args));
//  return result;
//};
//
//module.exports = { displayHome, openModal };