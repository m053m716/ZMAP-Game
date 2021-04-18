const MongoClient = require("mongodb").MongoClient;
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
  }
};
