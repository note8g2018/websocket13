const DB = require('./db/db_DB');
const LogIn = require('./db/login_DB');
const http = require('http');
const sockjs = require('sockjs');
const sockserver = sockjs.createServer();

const wsList = [];
const wsUserNameList = [];

async function start()
{
  await DB.run();
}
start();

sockserver.on('connection', function (ws) 
{
  const ip = ws.remoteAddress;
  const port = ws.remotePort;
  console.log(`${ip} on port ${port} is Connected`);
  wsList.push(ws);

  async function mongoDB()
  {
    const dbName = 'flutter';
    const db = DB.client.db(dbName);
    const articleCollection = db.collection('articles');
    let changeStream = articleCollection.watch({ fullDocument: 'updateLookup' });
    changeStream.on('change', next => 
    {
      console.log('change 1');
      if (next.fullDocument !== undefined)
      {
        console.log(next.fullDocument);
        ws.write(JSON.stringify(next.fullDocument));
        // wsList.forEach((item, index, array) =>
        // {
        //   if(item.readyState === 1)
        //   {
        //     console.log(next.fullDocument);
        //     item.write(JSON.stringify(next.fullDocument));
        //   }          
        // });
      }
    });
  }
  mongoDB();

  ws.on('data', async function (message) 
  {
    const data = JSON.parse(message);
    const userName = data['userName'];
    const passWord = data['passWord'];
    console.log(userName);
    wsUserNameList.push(userName);
    const isLogin = await LogIn.checkLogin(userName, passWord);
    if(!isLogin)
    {
      ws.close();
    }
  });

  ws.on('close', function () 
  {
    const index = wsList.indexOf(ws);
    wsUserNameList.splice(index, 1);
    wsList.splice(index, 1); // remove the connection
    console.log(`${ip} on port ${port} is DisConnected`);
  });
});

const http_server = http.createServer();
sockserver.installHandlers(http_server, { prefix: '/sockserver' });
http_server.listen(3050, '192.168.1.100'); // http://localhost:3000/sockserver/websocket