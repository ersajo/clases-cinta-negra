const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 4000;

const sayHello = (req, res, next) => {
  req.regards = 'Hola que tal';
  next();
}

app.use(express.json({extended: true}));
app.use(sayHello)

app.get('/', (request, response) => {
  console.log(request.regards);
  response.sendFile('home.html', { root: __dirname });
});

app.post('/post', ({ body }, response) => {
  const { password } = body;
  //validatePassword(password);
  response.send(body);
});


app.get('/pokemon/:id', ({ params }, response) => {
  response.send(`Se hizo la peticion del pokemon ${params.id}`);
});

// Endpoint que responda {  “mensaje”: <Lo que venga del parametro> }
app.get('/message', ({query}, response) => {
  response.send(query.mensaje);
});

// Endpoint que simule acceso a un api a través del login
app.post('/login', ({ body }, response) => {
  const { user, password } = body;
  if (!user) response.send('<h1>Usuario no encontrado</h1>');
  if (!password) response.send('<h1>Inserte una contraseña</h1>');
  response.send('<h1>Bienvenido a la API, ya estas loggeado</h1>');
});

// Endpoint pokemon reciba el numero de id o el nombre del pokémon y lo busque en la pokeapi (Axios)
app.get('/externalApi/:id', async ({ params }, response, next) => {
  const { id } = params;
  try {
    const { data } = await axios.get(`https://rickandmortyapi.com/api/character/${id}`);
    response.send(`El persnoaje es ${data.name} y su id es ${data.id}`);
  } catch (error) {
    next(error);
  }
});

//ejemplo de usop query params en endpoint tipo get
app.get('/queryParams', ({ query }, response) => {
  if (!query) response.send('<h1>No se encontro query</h1>');
  response.send(query);
});

// ejemplo de uso de parametros endpoint tipo get
app.get('/params', ({ params }, response) => {
  if (!params) response.send('<h1>No se encontraron parametros</h1>');
  response.send(params);
});

//ejemplo de uso de body con tres endpoint
app.delete('/body', ({ body }, response) => {
  body.message = 'Delete con body'; 
  response.send(body);
});

app.put('/body', ({ body }, response) => {
  body.message = 'Put con body'; 
  response.send(body);
});

app.patch('/body', ({ body }, response) => {
  body.message = 'Patch con body'; 
  response.send(body);
});

app.listen(PORT, () => {
  console.log(`Se ha incializado la aplicación en el puerto ${PORT}`);
});