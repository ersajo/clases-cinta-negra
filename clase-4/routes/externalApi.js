const express = require('express');
const axios = require('axios');
const router = express.Router();

router.get('/externalApi/:id', async (req, res, next) => {
  try {
    const { params } = req;
    if (typeof(params.id) != Number) throw new Error('Id is not a number');
    const { data } = await axios.get(`https://rickandmortyapi.com/api/character/${params.id}`);
    res.send(`El persnoaje es ${data.name} y su id es ${data.id}`).status(200);
  } catch (error) {
    next(error);
  }
});

router.get('/externalApi/', async (req, res, next) => {
  try {
    const { query } = req;
    const { data } = await axios.get(`https://rickandmortyapi.com/api/character/?name=${query.name}`);
    res.send({message: 'Aqui estan los resultados', characters: data}).status(200);
  } catch (error) {
    next(error);
  }
});

module.exports = router;