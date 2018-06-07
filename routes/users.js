const findUser = (id, database) => {
  return database
    .select('*')
    .from('users')
    .where({
      id: id
    });
}

const handleGetProfile = (req, res, database) => {
  const { id } = req.params;
  findUser(id, database)
  .then(user => {
    if (user) {
      res.json(user[0]);
    }
  })
  .catch(err => {
    res.status(404).json('User not found');
  });
};

module.exports = {
  handleGetProfile: handleGetProfile
};
