const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("project_nodejs", "root", "khiemvn412", {
    host: "127.0.0.1",
    dialect: "mysql",
});

export default sequelize;
