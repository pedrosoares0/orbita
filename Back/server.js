const express = require('express');
const cors = require('cors');
const path = require('path');
const { Usuario, Curso, UsuariosCursos, database } = require('./models');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../Front')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../Front/index.html'));
});

database.authenticate()
  .then(() => console.log('Conectado ao MySQL com Sequelize.'))
  .catch(err => console.error('Erro de conexão:', err));

app.get('/cursos', async (req, res) => {
  try {
    const cursos = await Curso.findAll();
    res.json(cursos.map(curso => curso.toJSON()));
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar cursos.', detalhes: err.message });
  }
});

app.post('/cta-button', (req, res) => {
  const { cursoId } = req.body;
  console.log(`Usuário se inscreveu no curso com ID: ${cursoId}`);
  res.json({ mensagem: 'Inscrição recebida com sucesso!' });
});

app.post('/cadastro', async (req, res) => {
  const { nome, sobrenome, email, senha, tipo = 'aluno', cursos = [] } = req.body;

  if (!nome || !sobrenome || !email || !senha) {
    return res.status(400).json({ mensagem: 'Preencha todos os campos obrigatórios.' });
  }

  try {
    const usuarioExistente = await Usuario.findOne({ where: { email } });
    if (usuarioExistente) {
      return res.status(409).json({ mensagem: 'Este email já está cadastrado.' });
    }

    const novoUsuario = await Usuario.create({
      nome: `${nome} ${sobrenome}`,
      email,
      senha,
      tipo
    });

    if (Array.isArray(cursos) && cursos.length > 0) {
      const cursosEncontrados = await Curso.findAll({
        where: { titulo: cursos }
      });

      if (cursosEncontrados.length === 0) {
        return res.status(404).json({ mensagem: 'Nenhum curso encontrado com esses nomes.' });
      }

      await novoUsuario.addCursos(cursosEncontrados);
    }

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

    const cursos = await usuario.getCursos();

    res.status(200).json({ mensagem: 'Login bem-sucedido!', usuario, cursos });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ mensagem: 'Erro no processo de login.', detalhes: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
