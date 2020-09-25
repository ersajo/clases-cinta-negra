const dotenv = require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');

const api = express();

const PORT = process.env.PORT || 4000;

// MIDDLEWARE
api.use(express.json({extended: true}));

mongoose.connect( process.env.MONGO_URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
)
.then(() => console.log('DB connected'))
.catch(() => console.log('Error connecting to db'));

// MODELS
const perroSchema = new mongoose.Schema({
  name: String,
  race: Number,
  age: Number,
  owner: {
    type: String,
    required: true
  }
});

const Perros = mongoose.model('PerrosBonitos', perroSchema);

// CONTROLLERS
api.get('/', (req, res) => {
  res.status(200).json({message:"Esta vivooo!"})
});

api.post('/api/v2/create/dog', (req, res) => {
  const { name, race, age, owner } = req.body;
  
  const newDog = new Perros({
    name,
    race,
    age,
    owner
  });
  
  newDog.save()
    .then(resMongo => res.status(201).json(resMongo))
    .catch(err => res.status(400).json({...err, error: err.message}));
});

api.get('/api/v2/list/dog', (req, res) => {
  Perros.find()
    .then(resMongo => res.status(201).json(resMongo))
    .catch(err => res.status(400).json({...err, error: err.message}));
});



//Endpoint que busque al perro por id
api.get('/api/v2/get/dog/:id', ({ params }, res) => {
  const { id } = params;
  Perros.find({_id: id})
    .then(resMongo => res.status(201).json(resMongo))
    .catch(err => res.status(400).json({ ...err, error: err.message }));
});

//Endpoint que actualice a un perro
api.patch('/api/v2/modify/dog/:id', (req, res) => {
  const { name, race, age, owner } = req.body;
  const { id, field } = req.params;
  const replace = {};
  if (name) replace.name = name;
  if (race) replace.race = race;
  if (age) replace.age = age;
  if (owner) replace.owner = owner;
  Perros.updateOne(
    { _id: id },
    {
      $set: replace
    }
  )
  .then(resMongo => res.status(201).json(resMongo))
  .catch(err => res.status(400).json({ ...err, error: err.message }));
});

//Endpoint borre a un perro
api.delete('/api/v2/delete/dog/:id', ({params}, res) => {
  const { id } = params;
  Perros.deleteOne({ _id: id })
    .then(resMongo => res.status(201).json(resMongo))
    .catch(err => res.status(400).json({ ...err, error: err.message }));
});

//Endpoint que haga una lista de perros y lo haga de 3 en 3
api.get('/api/v2/list/dog/page/:page', ({params}, res) => {
  const { page } = params;
  const skip = 3 * (page - 1);
  Perros.find().skip(skip).limit(3)
    .then(resMongo => res.status(201).json(resMongo))
    .catch(err => res.status(400).json({ ...err, error: err.message }));
});

//Endpoint que reemplace el perro completo
api.put('/api/v2/replace/dog/:id', (req, res) => {
  const { name, race, age, owner } = req.body;
  const { id } = req.params;
  Perros.update(
    { _id: id },
    {
      $set: {
        name,
        race,
        age,
        owner
      }
    }
  )
  .then(resMongo => res.status(201).json(resMongo))
  .catch(err => res.status(400).json({ ...err, error: err.message }));
});

api.listen(PORT, () => {
  console.log(`Server initialized on port http://localhost:${PORT}`);
});