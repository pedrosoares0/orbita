const { Curso, database } = require('./models');

async function seedCursos() {
  try {
    await database.authenticate();
    console.log('🟢 Conectado ao banco de dados.');

    const cursos = [
      { titulo: 'UX/UI Design', descricao: 'Curso de design centrado no usuário.' },
      { titulo: 'Programação', descricao: 'Lógica e linguagens de programação.' },
      { titulo: 'Cyber Segurança', descricao: 'Fundamentos de segurança digital.' },
      { titulo: 'Ciência de Dados', descricao: 'Análise de dados e machine learning.' }
    ];

    for (const curso of cursos) {
      const [registro, criado] = await Curso.findOrCreate({
        where: { titulo: curso.titulo },
        defaults: curso
      });
      if (criado) {
        console.log('✅ Curso "${curso.titulo}" inserido.');
      } else {
        console.log('ℹ Curso "${curso.titulo}" já existe.');
      }
    }

    console.log('✅ Seed finalizado com sucesso.');
    process.exit(0);
  } catch (err) {
    console.error('🔴 Erro ao executar seed:', err);
    process.exit(1);
  }
}

seedCursos();