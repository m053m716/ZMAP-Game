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
    this.docs = [];
  }
  async get_docs(db, collection, query) {
    const client = new MongoClient(this.uri, {useNewUrlParser: true, useUnifiedTopology: true})
    return client.connect((err, cli) => {
        if (err) {
          console.log("Connection error!");
          console.log(err);
        } else {
          return cli.db(db).collection(collection)
            .find(query)
            .toArray((err, result) => {
              if (err) {
                console.log("Query error!");
                console.log(err);
              } else {
                this.docs.length = 0;
                result.forEach(doc => {
                  this.docs.push(
                    "" + doc.name.first + " " + doc.name.last + ": " + doc.about
                  );
                });
              }
            })
        }
      })
  }
};
