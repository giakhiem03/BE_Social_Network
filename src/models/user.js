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
            User.hasMany(models.Friendship, {
                foreignKey: "user_id_1",
                as: "friendship_1", // những lời mời bạn bè đã gửi đi
            });

            User.hasMany(models.Friendship, {
                foreignKey: "user_id_2",
                as: "friendship_2", // những lời mời bạn bè đã nhận
            });
        }
    }
    User.init(
        {
            fullName: DataTypes.STRING,
            username: DataTypes.STRING,
            password: DataTypes.STRING,
            gender: DataTypes.INTEGER,
            email: DataTypes.STRING,
            avatar: DataTypes.TEXT,
        },
        {
            sequelize,
            modelName: "User",
        }
    );
    return User;
};
