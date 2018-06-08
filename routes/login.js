const handleLogin = (req, res, database, bcrypt) => {
  console.log('logging in...');
  const { email, password } = req.body;
  if(!email || !password) {
    return res.status(400).json('Incorrect form submission');
  }
  database
  .select('email', 'hash')
  .from('login')
  .where('email', '=', email)
    .then(data => {
      console.log(data);
      const isValidPassword = bcrypt.compareSync(password, data[0].hash);
      console.log(isValidPassword)
      if(isValidPassword) {
        return database.select('*')
        .from('users')
        .where('email', '=', email)
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
