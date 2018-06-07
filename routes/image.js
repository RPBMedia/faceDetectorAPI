const handleGetImage = (req, res, database) => {
  const { id } = req.body;
  database('users').where('id', '=', id)
  .increment('entries', 1)
  .returning('entries')
  .then(entries => {
    res.json(entries[0]);
  })
  .catch(err => res.status(400).json("User not found to retrieve entries"));
};

module.exports = {
  handleGetImage: handleGetImage
};
