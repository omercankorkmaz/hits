const express = require('express');
const bodyParser = require('body-parser');
const cassandra = require('cassandra-driver');
const bcrypt = require('bcryptjs');

const program = async () => {
  const app = express();

  app.use(bodyParser.json()); // support json encoded bodies
  app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies


  const authProvider = new cassandra.auth.PlainTextAuthProvider('admin', 'adminpassword');
  const client = new cassandra.Client({
    contactPoints: ['157.175.99.254:9042'],
    localDataCenter: 'datacenter1',
    keyspace: 'hits', //
    authProvider
  });

  app.get('/', (req, res) => {
    return res.send({ error: true, message: 'hello' });
  });

  app.post('/get-messages/', async (req, res) => {
    console.log('Connected!');
    //const roomName = req.params.roomName;
    const roomName = req.body.roomName;
    const query = 'SELECT * FROM chat_messages WHERE to_group = ?';
    const args = [roomName];
    client.execute(query, args)
      .then(result => {
        console.log('result.rows', result.rows);
        res.send(result.rows);
      })
      .catch(err => console.error(err));
  });

  app.post('/add-new-message', async (req, res) => {
    console.log('Connected!');
    const args = {
      from_user: req.body.from_user,
      to_group: req.body.to_group,
      time: req.body.time,
      body: bcrypt.hashSync(req.body.body, 10),
      from_user_dep: req.body.from_user_dep,
      from_user_role: req.body.from_user_role
    };
    console.log(args);
    const query = 'INSERT INTO chat_messages (from_user, to_group, time, body, from_user_dep, from_user_role) VALUES (?,?,?,?,?,?)';
    client.execute(query, args, { prepare: true })
      .then(result => res.send(result))
      .catch(err => console.error(err));
  });

  //myInstance.on(MySQLEvents.EVENTS.CONNECTION_ERROR, console.error);
  //myInstance.on(MySQLEvents.EVENTS.ZONGJI_ERROR, console.error);

  app.listen(3005, () => {
   console.log('You can see the data.');
  });
}

program()
  .then(() => console.log('Waiting for database events...'))
  .catch(console.error);
