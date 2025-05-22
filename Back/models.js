const { Sequelize, DataTypes } = require('sequelize');
const database = new Sequelize('Projetoo', 'root', 'neto', {
  host: 'localhost',
  dialect: 'mysql'
});

// PLANOS
const Plano = database.define('Plano', {
  nome: DataTypes.STRING(50),
  descricao: DataTypes.TEXT
});

// USUARIOS
const Usuario = database.define('Usuario', {
  nome: DataTypes.STRING(100),
  email: { type: DataTypes.STRING(100), unique: true },
  senha: DataTypes.STRING(255),
  tipo: DataTypes.ENUM('aluno', 'professor', 'admin'),
  data_cadastro: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
});
Plano.hasMany(Usuario, { foreignKey: 'plano_id' });
Usuario.belongsTo(Plano, { foreignKey: 'plano_id' });

// CURSOS
const Curso = database.define('Curso', {
  titulo: DataTypes.STRING(100),
  descricao: DataTypes.TEXT,
  categoria: DataTypes.STRING(50),
  carga_horaria: DataTypes.INTEGER
});

// RELAÇÃO USUARIO-CURSO (N:N)
const UsuariosCursos = database.define('UsuariosCursos', {}, { timestamps: false });
Usuario.belongsToMany(Curso, { through: UsuariosCursos, foreignKey: 'usuario_id' });
Curso.belongsToMany(Usuario, { through: UsuariosCursos, foreignKey: 'curso_id' });

// TURMAS
const Turma = database.define('Turma', {
  nome: DataTypes.STRING(100),
  data_inicio: DataTypes.DATE,
  data_fim: DataTypes.DATE
});
Curso.hasMany(Turma, { foreignKey: 'curso_id' });
Turma.belongsTo(Curso, { foreignKey: 'curso_id' });
Usuario.hasMany(Turma, { foreignKey: 'professor_id' });
Turma.belongsTo(Usuario, { as: 'professor', foreignKey: 'professor_id' });

// ALUNOS_TURMAS (N:N)
const AlunosTurmas = database.define('AlunosTurmas', {}, { timestamps: false });
Usuario.belongsToMany(Turma, { through: AlunosTurmas, foreignKey: 'aluno_id' });
Turma.belongsToMany(Usuario, { through: AlunosTurmas, foreignKey: 'turma_id' });

// MODULOS
const Modulo = database.define('Modulo', {
  titulo: DataTypes.STRING(100),
  ordem: DataTypes.INTEGER
});
Curso.hasMany(Modulo, { foreignKey: 'curso_id' });
Modulo.belongsTo(Curso, { foreignKey: 'curso_id' });

// VIDEOS
const Video = database.define('Video', {
  titulo: DataTypes.STRING(100),
  url_video: DataTypes.TEXT,
  duracao: DataTypes.INTEGER
});
Modulo.hasMany(Video, { foreignKey: 'modulo_id' });
Video.belongsTo(Modulo, { foreignKey: 'modulo_id' });

// APOSTILAS
const Apostila = database.define('Apostila', {
  titulo: DataTypes.STRING(100),
  arquivo_url: DataTypes.TEXT
});
Modulo.hasMany(Apostila, { foreignKey: 'modulo_id' });
Apostila.belongsTo(Modulo, { foreignKey: 'modulo_id' });

// AVALIAÇÕES
const Avaliacao = database.define('Avaliacao', {
  titulo: DataTypes.STRING(100),
  descricao: DataTypes.TEXT
});
Modulo.hasMany(Avaliacao, { foreignKey: 'modulo_id' });
Avaliacao.belongsTo(Modulo, { foreignKey: 'modulo_id' });

// PROGRESSO_ALUNO
const ProgressoAluno = database.define('ProgressoAluno', {
  progresso_video: DataTypes.INTEGER,
  baixou_apostila: DataTypes.BOOLEAN,
  nota_avaliacao: DataTypes.DECIMAL(5, 2),
  data_ultima_interacao: DataTypes.DATE
}, {
  tableName: 'progresso_aluno',
  timestamps: false
});
ProgressoAluno.belongsTo(Usuario, { foreignKey: 'aluno_id' });
ProgressoAluno.belongsTo(Video, { foreignKey: 'video_id' });
ProgressoAluno.belongsTo(Apostila, { foreignKey: 'apostila_id' });
ProgressoAluno.belongsTo(Avaliacao, { foreignKey: 'avaliacao_id' });

// PARCERIAS
const Parceria = database.define('Parceria', {
  descricao_projeto: DataTypes.TEXT,
  percentual_plataforma: DataTypes.DECIMAL(5, 2),
  data_assinatura: DataTypes.DATE,
  contrato_url: DataTypes.TEXT
});
Usuario.hasMany(Parceria, { foreignKey: 'aluno_id' });
Parceria.belongsTo(Usuario, { foreignKey: 'aluno_id' });


module.exports = {
  database,
  Plano,
  Usuario,
  Curso,
  UsuariosCursos,
  Turma,
  AlunosTurmas,
  Modulo,
  Video,
  Apostila,
  Avaliacao,
  ProgressoAluno,
  Parceria
};