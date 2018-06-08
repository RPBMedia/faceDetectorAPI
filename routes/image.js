const Clarifai = require('clarifai');


const app = new Clarifai.App({
 apiKey: 'f82243a424b74d87bde857025d8438a6'
});

const handleApiCall = (req, res) => {
  app.models
    .predict(Clarifai[req.body.selectedModel], req.body.input)
    .then(data => {
      res.json(data);
    })
    .catch(err => res.status(400).json("Error getting image url"));
}

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
  handleGetImage,
  handleApiCall,
};
