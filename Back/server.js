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
app.post('/cadastro', async (req, res) => {
  const { nome, sobrenome, email, senha, tipo = 'aluno' } = req.body;

  if (!nome || !sobrenome || !email || !senha) {
    return res.status(400).json({ mensagem: 'Preencha todos os campos obrigatórios.' });
  }

  try {
    // Verificar se já existe usuário com o mesmo email
    const usuarioExistente = await Usuario.findOne({ where: { email } });
    if (usuarioExistente) {
      return res.status(409).json({ mensagem: 'Este email já está cadastrado.' });
    }

    const novoUsuario = await Usuario.create({
      nome: `${nome} ${sobrenome}`,
      email,
      senha, // ⚠️ Ideal: use bcrypt para criptografar em produção
      tipo
    });

    res.status(201).json({ mensagem: 'Cadastro realizado com sucesso!', usuario: novoUsuario });
  } catch (error) {
    console.error('Erro no cadastro:', error);
    res.status(500).json({ mensagem: 'Erro ao cadastrar usuário.', detalhes: error.message });
  }
});

app.post('/login', async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ mensagem: 'Email e senha são obrigatórios.' });
  }

  try {
    const usuario = await Usuario.findOne({ where: { email } });

    if (!usuario || usuario.senha !== senha) {
      return res.status(401).json({ mensagem: 'Email ou senha incorretos.' });
    }

    res.status(200).json({ mensagem: 'Login bem-sucedido!', usuario });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ mensagem: 'Erro no processo de login.', detalhes: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
