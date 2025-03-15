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
        }
    }

    Post.init(
        {
            image: DataTypes.BLOB("medium"),
            post_by: DataTypes.INTEGER,
            caption: DataTypes.TEXT,
            description: DataTypes.TEXT,
            quantity_reaction: DataTypes.INTEGER,
        },
        {
            sequelize,
            modelName: "Post",
        }
    );
    return Post;
};
