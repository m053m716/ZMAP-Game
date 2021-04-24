const ed = require('noble-ed25519');
const crypto = require('crypto');
const MongoClient = require("mongodb").MongoClient;
class Database {
  constructor(url, secret_key) {
    this.uri = url;
    this.secret_key = secret_key
  }
  async get_docs(db_name, collection_name, query, cb = null) {
    const client = new MongoClient(this.uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    await client.connect(async err => {
      if (err) throw err;
      const collection = client.db(db_name).collection(collection_name);
      await collection.find(query).toArray(async function(err_query, result) {
        if (err_query) throw err_query;
        // console.log(result);
        await client.close();
        if (cb !== null) {
          cb(result);
        }
      });
    });
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
    const hashed_message = await Database.encrypt(password);
    const public_key = await ed.getPublicKey(this.secret_key);
    const signature = await ed.sign(hashed_message, this.secret_key);
    const result = { 
      key: public_key,
      signature: signature
    }
    if (cb !== null) {
      cb(result);
    }    
  }
  async check_password(password, signature, key, cb=null) {
    const hashed_message = await Database.encrypt(password);
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

const myDatabase = new Database(process.env.MONGODB_CONNECTION_STRING, process.env.SECRET_PW_KEY)

module.exports = { myDatabase }