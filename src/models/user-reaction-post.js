"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class User_React_Post extends Model {
        static associate(models) {
            User_React_Post.belongsTo(models.User, {
                foreignKey: "user_id",
                targetKey: "id",
                as: "user",
            });
            User_React_Post.belongsTo(models.Post, {
                foreignKey: "post_id",
                targetKey: "id",
                as: "post",
            });
        }
    }
    User_React_Post.init(
        {
            user_id: DataTypes.INTEGER,
            post_id: DataTypes.INTEGER,
        },
        {
            sequelize,
            modelName: "User_React_Post",
            tableName: "User_Reaction_Post",
        }
    );
    return User_React_Post;
};
