"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        static associate(models) {
            User.belongsTo(models.Gender, {
                foreignKey: "gender",
                targetKey: "id",
                as: "genders",
            });
            // User.hasOne(models.Markdown, {
            //     foreignKey: "doctorId",
            // });
        }
    }
    User.init(
        {
            fullName: DataTypes.STRING,
            username: DataTypes.STRING,
            password: DataTypes.STRING,
            gender: DataTypes.INTEGER,
            email: DataTypes.STRING,
            avatar: DataTypes.BLOB("medium"),
        },
        {
            sequelize,
            modelName: "User",
        }
    );
    return User;
};
