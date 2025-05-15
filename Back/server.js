const express = require('express');
const cors = require('cors');
const path = require('path');

const { Curso, database } = require('./models');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Serve todos os arquivos estáticos da pasta Front
app.use(express.static(path.join(__dirname, '../Front')));

// Serve o index.html na rota /
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../Front/index.html'));
});

// Testar conexão com o banco
database.authenticate()
  .then(() => console.log('Conectado ao MySQL com Sequelize.'))
  .catch(err => console.error('Erro de conexão:', err));

// Rota para listar cursos
app.get('/cursos', async (req, res) => {
  try {
    const cursos = await Curso.findAll();
    const cursosJson = cursos.map(curso => curso.toJSON());
    res.json(cursosJson);
  } catch (err) {
    console.error('Erro ao buscar cursos:', err);
    res.status(500).json({ erro: 'Erro ao buscar cursos.', detalhes: err.message });
  }
});

app.post('/cta-button', (req, res) => {
  const { cursoId } = req.body;
  console.log(`Usuário se inscreveu no curso com ID: ${cursoId}`);
  res.json({ mensagem: 'Inscrição recebida com sucesso!' });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
