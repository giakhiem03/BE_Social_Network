"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Post extends Model {
        static associate(models) {
            Post.belongsTo(models.User, {
                foreignKey: "post_by",
                targetKey: "id",
                as: "userPost",
            });

            Post.hasMany(models.Comment, {
                foreignKey: "post_id",
                as: "comments",
            });

            Post.hasMany(models.User_React_Post, {
                foreignKey: "post_id",
                as: "reaction",
            });
        }
    }

    Post.init(
        {
            image: DataTypes.TEXT,
            post_by: DataTypes.INTEGER,
            description: DataTypes.TEXT,
        },
        {
            sequelize,
            modelName: "Post",
        }
    );
    return Post;
};
