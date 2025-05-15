const express = require('express');
const cors = require('cors');
const { Curso, database } = require('./models');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Testar conexão com o banco
database.authenticate()
  .then(() => console.log('Conectado ao MySQL com Sequelize.'))
  .catch(err => console.error('Erro de conexão:', err));

// Rota para listar cursos
app.get('/cursos', async (req, res) => {
  try {
    const cursos = await Curso.findAll();
    const cursosJson = cursos.map(curso => curso.toJSON()); // Mapeia para JSON simples
    res.json(cursosJson);
  } catch (err) {
    console.error('Erro ao buscar cursos:', err);
    res.status(500).json({ erro: 'Erro ao buscar cursos.', detalhes: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
