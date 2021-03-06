const mongoose = require('mongoose');

mongoose.connect(
  process.env.MONGO_URI
  , {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
)
  .then( () => {
    console.log('Connected to mongoDB');
  })
  .catch( err => {
    console.log('Error connecting to database', err.message);
  });