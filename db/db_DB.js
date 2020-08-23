const MongoClient = require("mongodb").MongoClient;
const config = require('./config.json');

const uri = config.uri;

let client = new MongoClient(uri,
  { 'useUnifiedTopology': true, 'keepAlive': true });

async function run()
{
  try
  {
    await client.connect();
    console.log("Connected successfully to MongoDB");
  }
  catch (err) 
  {
    console.log(err);
  }
}

module.exports = {
  client,
  run,
};
