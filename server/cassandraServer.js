const express = require('express');
const bodyParser = require('body-parser');
const cassandra = require('cassandra-driver');
const bcrypt = require('bcryptjs');
const port = 3005;

const program = async () => {
  const app = express();

  app.use(bodyParser.json()); // support json encoded bodies
  app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

  const authProvider = new cassandra.auth.PlainTextAuthProvider('admin', 'adminpassword');
  const client = new cassandra.Client({
    contactPoints: ['ip-address-of-our-cassandra-server:9042'],
    localDataCenter: 'datacenter1',
    keyspace: 'hihts', //
    authProvider
  });

  app.get('/', (req, res) => {
    return res.send({ error: true, message: 'hello' });
  });

  app.post('/get-messages/', async (req, res) => {
    const roomName = req.body.roomName;
    // executing query for getting messages sent on the given roomname
  });

  app.post('/add-new-message', async (req, res) => {
    const args = {
      from_user: req.body.from_user,
      to_group: req.body.to_group,
      time: req.body.time,
      body: bcrypt.hashSync(req.body.body, 10),
    };
    // executing query for setting new message 
  });

  app.listen(port, () => {
   console.log('You can see the data.');
  });
}

program()
  .then(() => console.log('Waiting for database events...'))
  .catch(console.error);
