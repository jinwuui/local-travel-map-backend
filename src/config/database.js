const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize({
  dialect: process.env.DB_DIALECT || "postgres",
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  logging: false, // SQL 쿼리를 로그에 표시하지 않으려면 설정
  define: {
    underscored: true, // 테이블과 컬럼 이름을 스네이크 케이스로 변환
  },
});

module.exports = sequelize;
