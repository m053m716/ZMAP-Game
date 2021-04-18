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
  constructor(uri) {
    this.uri = uri;
    this.data = null;
    this.docs = [];
  }
  async get_docs(db, collection, query) {
    const client = new MongoClient(this.uri, {useNewUrlParser: true, useUnifiedTopology: true})
    await client.connect()
    this.data = await client.db(db).collection(collection).find(query).toArray()
    this.docs.length = 0;
    this.data.forEach(doc => {
      this.docs.push(
        "" + doc.name.first + " " + doc.name.last + ": " + doc.about
      );
    });
  }
};
