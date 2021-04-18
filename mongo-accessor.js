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
  }
};

const client = new MongoClient(this.uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
client.connect(err => {
  this.collection = client.db(db).collection(collection);
  client.close();
});
