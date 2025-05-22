const { database } = require('./models');

database.authenticate()
  .then(() => {
    console.log('🟢 Conectado com sucesso ao banco de dados.');
    return database.sync();
  })
  .then(() => console.log('🟢 Tabelas sincronizadas.'))
  .catch(err => console.error('🔴 Erro ao conectar:', err));
