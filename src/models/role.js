"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Role extends Model {
        static associate(models) {}
    }

    Role.init(
        {
            role_name: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: "Role",
        }
    );
    return Role;
};
