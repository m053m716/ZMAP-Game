const MongoClient = require('mongodb').MongoClient;
module.exports = class MongoAccessor {
  constructor() {
    this.uri = process.env.DB_URI;
    
  }
  
}

const client = new MongoClient(this.uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});