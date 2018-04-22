const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());

const database = {
  users: [
    {
      id: '001',
      name: 'Rui',
      email: 'rui@gmail.com',
      password: 'pass',
      entries: 0,
      joined: new Date(),
    }
  ]
}

const findUser = (id) => {
  const user = database.users.find((user) => {
    return user.id === id;
  })
  if (user) {
    return user;
  } else {
    return null;
  }
}

app.get('/', (req, res) => {
  res.send('Server working. Users registered: '+database.users.length);
});

app.post('/login', (req, res) => {
  if (req.body.email === database.users[0].email &&
      req.body.password === database.users[0].password) {
        res.json('success');
  } else {
    res.status(400).json('error loggin in');
  }
  res.json('login');
});

app.post('/register', (req, res) => {
  const { email, name, password } = req.body;
  database.users.push({
    id: '00122',
    name: name,
    email: email,
    password: password,
    entries: 0,
    joined: new Date(),
  });
  res.json(`User ${database.users[database.users.length-1].name} is now registered`);

});

app.get('/profile/:id', (req, res) => {
  const { id } = req.params;
  const user = findUser(id);
  if (user) {
    res.json(user);
  } else {
    res.status(404).json('User not found');
  }
});

app.put('/image', (req, res) => {
  const { id } = req.body;
  const user = findUser(id);
  if (user) {
    user.entries++;
    res.json(user.entries);
  } else {
    res.status(404).json('User not found');
  }
});


const listener = app.listen(3000, () => {
  console.log('Magic happens on port '+ listener.address().port);
})