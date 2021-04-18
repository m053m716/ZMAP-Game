const MongoClient = require("mongodb").MongoClient;
class PromiseHandler {
  constructor(verbose = false) {
    this.data = null;
    this.verbose = verbose;
  }
  async rejectedCB(err, cb) {
    if (this.verbose) {
      console.log("Promise rejected!");
      if (err) {
        console.log(err);
      }
    }
  }
  async acceptedCB(result, cb) {
    if (this.verbose) {
      console.log("Promise accepted!");
    }
  }
}

module.exports = class MongoAccessor {
  constructor() {
    this.uri = process.env.DB_URI;
    this.docs = [];
  }
  async get_docs(db, collection, query, cb=null) {
    const client = new MongoClient(this.uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    await client.connect(async err => {
      const collection = await client.db(db).collection(collection);
      await collection.find(query).toArray(async (err_query, result) => {
        if (err_query) {
          console.log("Query error!");
          console.log(err_query);
        } else {
          this.docs = result;
          if (cb !== null) {
            await cb(result);
          }
        }
      });
      client.close();
    });
  }
};
