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
  async get_docs(db, collection, query, cb = null) {
    const client = await new MongoClient(this.uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    await client.connect(async (err_conn) => {
      try {
        if (err_conn) {
          console.log("Connection error!");
          console.log(err_conn);
        } else {
          const collection = await client.db(db).collection(collection);
          await collection.find(query).toArray(async (err_query, result) => {
            if (err_query) {
              console.log("Query error!");
              console.log(err_query);
            } else {
              this.docs.length = 0;
              result.forEach(doc => {
                this.docs.push(
                  "" + doc.name.first + " " + doc.name.last + ": " + doc.about
                );
              });
              if (cb !== null) {
                await cb(result);
              }
            }
          });
          client.close();
        }
      } catch (err) {
        console.log("General error!");
        console.log(err);
      }
    });
  }
};
