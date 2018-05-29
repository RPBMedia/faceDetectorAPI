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
  console.log('logging in...');
  database
  .select('email', 'hash')
  .from('login')
  .where('email', '=', req.body.email)
    .then(data => {
      console.log(data);
      const isValidPassword = bcrypt.compareSync(req.body.password, data[0].hash);
      console.log(isValidPassword)
      if(isValidPassword) {
        return database.select('*')
        .from('users')
        .where('email', '=', req.body.email)
        .then(user => {
          console.log(user);
          res.json(user[0])
        })
        .catch(err => res.status(400).json('unable to get user'));
      } else {
        re.status(400).json('wrong username or password');
      }
    })
    .catch(err => res.status(400).json('wrong credentials'));
});

app.post('/register', (req, res) => {
  const { email, name, password } = req.body;

  const hash = bcrypt.hashSync(password);
  database.transaction(trx => {
    trx.insert({
      hash: hash,
      email: email
    })
    .into('login')
    .returning('email')
    .then(loginEmail => {
      return trx('users')
        .returning('*')
        .insert({
          email: loginEmail[0],
          name: name,
          joined: new Date()
        })
        .then(user => {
          res.json(user[0]);
        })
    })
    .then(trx.commit)
    .catch(trx.rollback)
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
