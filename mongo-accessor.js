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
  get_docs(db, collection, query, cb = null) {
    const client = new MongoClient(this.uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    const out = client.connect(err_conn => {
      if (err_conn) {
        console.log("Connection error!");
        console.log(err_conn);
      } else {
        const p = client
          .db(db)
          .collection(collection)
          .find(query)
          .toArray(async (err_query, result) => {
            if (err_query) {
              console.log("Query error!");
              console.log(err_query);
            } else {
              this.docs.length = 0;
              await result.forEach(doc => {
                this.docs.push(
                  "" + doc.name.first + " " + doc.name.last + ": " + doc.about
                );
              });
              if (cb !== null) {
                cb(result);
              }
            }
          })
        return p
      }
    }).then(() => client.close());
    return out;
  }
};
