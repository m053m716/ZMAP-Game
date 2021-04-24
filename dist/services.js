require("dotenv").config();
const ed = require('noble-ed25519');
const crypto = require('crypto');
const MongoClient = require("mongodb").MongoClient;
const express = require("express");
const cors = require("cors"); // See: https://expressjs.com/en/resources/middleware/cors.html   Cross-origin resources configuration
const bodyParser = require("body-parser"); // See: https://www.npmjs.com/package/body-parser          Parses HTTP transaction body text prior to other handling

// DiceRoller class object that handles rolling dice
const DiceRoller = require("./private/DiceRoller");
// MessageBlock class object that handles voting on coffee etc.
const MessageBlock = require("./private/MessageBlock");
// Handle deployment of application home page
// const appHomeServices = require("./private/home-tab"); 

class User {
    constructor(id="none", username="none", name="none") {
        this.id = id;
        this.username = username;
        this.name = name;       
    }
}

class ClientSession {
  constructor() {
    
  }
}


class GameSession {
    constructor() {
      this.data = null;
      this._key = ed.utils.randomPrivateKey();
      this.key = ed.getPublicKey(this._key);
      this.clients = [];
    }
    startClient() {
          
    }
    addClient(id="none", username="none", name="none") {
        let user = new User(id, username, name);
        this.clients.push(user);
    }
}


class Database {
  constructor(uri, secret) {
    this.uri = uri;
    this.secret = secret;
    this.session = new GameSession();
  }
  async get_docs(db, collection, query) {
    const client = new MongoClient(this.uri, {useNewUrlParser: true, useUnifiedTopology: true})
    await client.connect()
    this.session.data = await client.db(db).collection(collection).find(query).toArray()
  }
  async get_user(uid) {
    const client = new MongoClient(this.uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    await client.connect();
    const data = client.db("User").collection("Identity").findOne({"uid": uid});
    return data
  }
  async safe_password(password, cb=null) {
    const hashed_message = await Database.encrypt(password);
    const public_key = await ed.getPublicKey(this.secret);
    const signature = await ed.sign(hashed_message, this.secret);
    const result = { 
      key: public_key,
      signature: signature
    }
    console.log(result);
    if (cb !== null) {
      cb(result);
    }    
  }
  async check_password(password, signature, key) {
    const hashed_message = await Database.encrypt(password);
    const isSigned = await ed.verify(signature, hashed_message, key);
    return isSigned;
  }
  static async encrypt(password) {
    const hash = crypto.createHash('sha512');
    hash.update(password);
    const hashed_message = await hash.digest('hex');
    return hashed_message
  }
};

class ZMAP extends express {
    constructor(static_folder="public") {
        super();
        // Configure AXIOS message handler
        this.axios = require("./private/axios-config.js").axios;
        // Create new Dice and Slack (block) objects
        this.block = new MessageBlock(); // Slack "Block" message
        this.dice = new DiceRoller();    // Handle dice generation
        this.signature = require("./private/authenticate"); // Handle verification of signature from Slack SECRET
        this.logs = require("./private/debug-console"); // Make console debugging easier  (maybe):
        const options = {
          dotfiles: 'allow',
          etag: false,
          extensions: ['htm', 'html'],
          index: false,
          maxAge: '1d',
          redirect: false,
          setHeaders: function (res, path, stat) {
              res.set('x-timestamp', Date.now());
          }
        }
        this.use(express.static(static_folder)); // make the files in this folder publically available
    }
}

const server = new Database(process.env.DB_URI, process.env.DB_SECRET);
const session = {
    game: new GameSession(), 
    client: new ClientSession()
}

const app = new ZMAP("public");

module.exports = { app, server, session };