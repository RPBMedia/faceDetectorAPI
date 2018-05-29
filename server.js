const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

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

// const database = {
//   users: [
//     {
//       id: '001',
//       name: 'Rui',
//       email: 'rui@gmail.com',
//       password: '1234',
//       entries: 0,
//       joined: new Date(),
//     }
//   ]
// }

const findUser = (id) => {
  return database
    .select('*')
    .from('users')
    .where({
      id: id
    });
}

const findUserByLogin = (email, pass) => {
  const user = database.users.find((user) => {
    console.log('Searching...', user);
    return user.email === email && user.password === pass;
  })
  if (user) {
    console.log('User FOUND!');
    return user;
  } else {
    return null;
  }
}





// // Load hash from your password DB.
// bcrypt.compare("bacon", hash, function(err, res) {
//     // res == true
// });
// bcrypt.compare("veggies", hash, function(err, res) {
//     // res = false
// });


//------------------ ROUTES -------------------

app.get('/', (req, res) => {
  res.send(database.users);
});

app.post('/login', (req, res) => {
  console.log(req.body);
  const userFound = findUserByLogin(req.body.email, req.body.password);

  if (userFound) {
        console.log('Login successful');
        res.json(userFound);
  } else {
    console.log('Login unsuccessful');
    res.status(400).json('error loggin in');
  }
});

app.post('/register', (req, res) => {
  const { email, name, password } = req.body;

  bcrypt.hash(password, null, null, function(err, hash) {
      console.log(hash);
  });

  database('users')
    .returning('*')
    .insert({
      email: email,
      name: name,
      joined: new Date()
    })
    .then(user => {
      res.json(user[0]);
    })
    .catch(err => res.status(400).json("unable to register user"));
});

app.get('/profile/:id', (req, res) => {
  const { id } = req.params;
  findUser(id)
  .then(user => {
    if (user) {
      res.json(user[0]);
    }
  })
  .catch(err => {
    res.status(404).json('User not found');
  });
});

app.put('/image', (req, res) => {
  const { id } = req.body;
  database('users').where('id', '=', id)
  .increment('entries', 1)
  .returning('entries')
  .then(entries => {
    res.json(entries[0]);
  })
  .catch(err => res.status(400).json("User not found to retrieve entries"));
});


const listener = app.listen(3000, () => {
  console.log('Magic happens on port '+ listener.address().port);
})
