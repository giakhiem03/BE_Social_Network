const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("project_nodejs", "root", "Admin@123", {
  host: "localhost",
  dialect: "mysql",
  port: 3307,
});

export default sequelize;
