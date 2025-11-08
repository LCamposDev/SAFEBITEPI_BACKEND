require('dotenv').config();
const { Sequelize } = require('sequelize');

// Configuração do banco de dados
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: 'postgres',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true
  }
});

// Testar conexão
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexão com o banco de dados estabelecida com sucesso.');
    console.log(`📊 Banco: ${process.env.DB_NAME}`);
    console.log(`🔌 Host: ${process.env.DB_HOST}:${process.env.DB_PORT}`);
  } catch (error) {
    console.error('❌ Erro ao conectar com o banco de dados:', error.message);
    console.error(
      '💡 Verifique se o PostgreSQL está rodando e se as credenciais no .env estão corretas.'
    );
  }
};

module.exports = {
  sequelize,
  testConnection
};
