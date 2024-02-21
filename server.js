const express = require('express'); // Importa el framework Express para crear el servidor web.
const axios = require('axios'); // Importa la biblioteca Axios para realizar solicitudes HTTP.
const cors = require('cors'); // Importa el middleware CORS para permitir solicitudes desde otros dominios.
const app = express(); // Crea una instancia de la aplicación Express.
const port = 3001; // Define el puerto en el que el servidor escuchará las solicitudes.

app.use(express.json()); // Agrega middleware para analizar el cuerpo de las solicitudes como JSON.
app.use(cors()); // Activa el middleware CORS para permitir solicitudes desde cualquier origen.

async function enviarPreguntaALlama(pregunta) { // Define una función asincrónica para enviar la pregunta a Ollama.
  try {
    const preguntaEspanol = pregunta + ' en español'; // Concatena "en español" a la pregunta.
    const respuesta = await axios.post('http://127.0.0.1:11434/api/generate', { // Envía una solicitud POST a Ollama.
      model: 'codellama', // Especifica el modelo para la generación de texto en Ollama.
      prompt: preguntaEspanol, // Proporciona la pregunta en español como prompt.
    });
    return respuesta.data.text || respuesta.data; // Retorna el texto de respuesta recibido de Ollama.
  } catch (error) {
    throw error; // Relanza el error para que sea manejado por la función que llama a esta función.
  }
}

app.post('/preguntar', async (req, res) => { // Define una ruta para manejar las solicitudes POST a '/preguntar'.
  const { pregunta } = req.body; // Extrae la pregunta del cuerpo de la solicitud.
  if (!pregunta) { // Verifica si la pregunta está presente en la solicitud.
    return res.status(400).send({ error: 'La solicitud debe contener una pregunta.' }); // Devuelve un error si la pregunta está ausente.
  }

  try {
    const textoRespuesta = await enviarPreguntaALlama(pregunta); // Envía la pregunta a Ollama y espera la respuesta.
    res.send({ respuesta: textoRespuesta }); // Envía la respuesta al cliente en formato JSON.
  } catch (error) {
    res.status(500).send({ error: 'Error al procesar la pregunta.' }); // Devuelve un error 500 si ocurre un error al procesar la pregunta.
  }
});

app.listen(port, () => {
    
});
