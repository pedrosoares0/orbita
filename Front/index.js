const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const { Usuario } = require('../Back/models');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Rota de cadastro
app.post('/cadastro', async (req, res) => {
  const { nome, sobrenome, email, senha } = req.body;

  try {
    const usuarioExistente = await Usuario.findOne({ where: { email } });
    if (usuarioExistente) {
      return res.status(400).json({ mensagem: 'Email já está em uso.' });
    }

    const senhaHash = await bcrypt.hash(senha, 10);

    await Usuario.create({
      nome: `${nome} ${sobrenome}`,
      email,
      senha: senhaHash,
      tipo: 'aluno'
    });

    res.json({ mensagem: 'Usuário cadastrado com sucesso!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensagem: 'Erro ao cadastrar usuário.' });
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
