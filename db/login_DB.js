const DB = require('./db_DB');

async function checkLogin(userName, passWord)
{
  try
  {
    const dbName = 'flutter';
    const db = DB.client.db(dbName);
    const personCollection = db.collection('person');
    const doc = await personCollection
    .findOne({'userName': userName, 'passWord': passWord, 'isLogin': true });
    if(doc === null)
    {
      return false;
    }
    else
    {
      return true;
    }
  }
  catch(err)
  {
    console.log(err);
  }
}

module.exports = {
  checkLogin,
}