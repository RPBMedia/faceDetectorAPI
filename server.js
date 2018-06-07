const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const register = require('./routes/register');
const login = require('./routes/login');
const users = require('./routes/users');
const image = require('./routes/image');

const database = knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'rui.baiao',
    password : '',
    database : 'facedetectordb'
  }
});

const app = express();

app.use(bodyParser.json());
app.use(cors());

//------------------ ROUTES -------------------

app.get('/', (req, res) => {
  res.send(database.users);
});

app.post('/login', (req ,res) => { login.handleLogin(req, res, database, bcrypt) });

app.post('/register', (req, res) => { register.handleRegister(req, res, database, bcrypt) });

app.get('/profile/:id', (req, res) => { users.handleGetProfile(req, res, database) });

app.put('/image', (req, res) => {image.handleGetImage(req, res, database) });


const listener = app.listen(3000, () => {
  console.log('Magic happens on port '+ listener.address().port);
})
