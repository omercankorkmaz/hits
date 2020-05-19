const express = require('express');
const bodyParser = require('body-parser');
const cassandra = require('cassandra-driver');
const bcrypt = require('bcryptjs');
const port = 3005;

const program = async () => {
 
  // express configurations

  // cassandra server configurations

  app.get('/', (req, res) => {
    return res.send({ error: true, message: 'hello' });
  });

  app.post('/get-messages/', async (req, res) => {
    
    // executing query for getting messages sent on the given roomname
    
  });

  app.post('/add-new-message', async (req, res) => {
    
    // executing query for setting new message 
    
  });

  app.listen(port, () => {
   console.log('You can see the data.');
  });
}

program()
  .then(() => console.log('Waiting for database events...'))
  .catch(console.error);
