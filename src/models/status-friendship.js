"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Status extends Model {
        static associate(models) {
            // define association here
        }
    }
    Status.init(
        {
            status: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: "Status",
        }
    );
    return Status;
};
