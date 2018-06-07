const handleLogin = (req, res, database, bcrypt) => {
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
};

module.exports = {
  handleLogin: handleLogin
};
