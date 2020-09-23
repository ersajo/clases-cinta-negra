const axios = require('axios');

const searchPokemon = async (param) => {
  try {
    const response  = await axios.get(`https://pokeapi.co/api/v2/pokemon/${param}`);
    console.log(response.data.name);
  } catch (error) {
    console.log(error.message);
  }
}

const searchCharacter = async (id) => {
  try {
    const response = await axios.get(`https://rickandmortyapi.com/api/character/${id}`);
    console.log(response.data.name);
  } catch (error) {
    console.log(error.message);
  }
}

searchPokemon('ditto');
searchPokemon('34000');
searchCharacter('2');