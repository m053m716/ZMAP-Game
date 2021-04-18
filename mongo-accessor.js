require("dotenv").config();
const ed = require('noble-ed25519');
const crypto = require('crypto');
const MongoClient = require("mongodb").MongoClient;
class MongoAccessor {
  constructor(uri, secret) {
    this.uri = uri;
    this.secret = secret;
    this.data = null;
    this.docs = [];
  }
  async get_docs(db, collection, query) {
    const client = new MongoClient(this.uri, {useNewUrlParser: true, useUnifiedTopology: true})
    await client.connect()
    this.data = await client.db(db).collection(collection).find(query).toArray()
  }
  async get_user(name, pw) {
    const client = new MongoClient(this.uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    await client.connect(async err => {
      if (err) throw err;
      const collection = client.db("User").collection("Profile");
      await collection.findOne({"name": name}, async (err, result) => {
        if (err) throw err;
        
      })
    })
  }
  async safe_password(password, cb=null) {
    const hashed_message = await MongoAccessor.encrypt(password);
    const public_key = await ed.getPublicKey(this.secret);
    const signature = await ed.sign(hashed_message, this.secret);
    const result = { 
      key: public_key,
      signature: signature
    }
    if (cb !== null) {
      cb(result);
    }    
  }
  async check_password(password, signature, key, cb=null) {
    const hashed_message = await MongoAccessor.encrypt(password);
    const isSigned = await ed.verify(signature, hashed_message, key);
    if (cb !== null) {
      cb(isSigned, password);
    } 
  }
  static async encrypt(password) {
    const hash = crypto.createHash('sha512');
    hash.update(password);
    const hashed_message = await hash.digest('hex');
    return hashed_message
  }
};

const server = new MongoAccessor(process.env.DB_URI, process.env.DB_SECRET);