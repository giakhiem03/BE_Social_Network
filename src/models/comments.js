"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Comment extends Model {
        static associate(models) {
            Comment.belongsTo(models.Post, {
                foreignKey: "post_id",
                targetKey: "id",
                as: "post",
            });
            Comment.belongsTo(models.User, {
                foreignKey: "user_id",
                targetKey: "id",
                as: "user",
            });
        }
    }

    Comment.init(
        {
            post_id: DataTypes.INTEGER,
            user_id: DataTypes.INTEGER,
            image: DataTypes.BLOB("medium"),
            content: DataTypes.TEXT,
        },
        {
            sequelize,
            modelName: "Comment",
        }
    );
    return Comment;
};
