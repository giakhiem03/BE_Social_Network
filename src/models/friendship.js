"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Friendship extends Model {
        static associate(models) {
            Friendship.belongsTo(models.User, {
                foreignKey: "user_id_1",
                targetKey: "id",
                as: "user_1",
            });
            Friendship.belongsTo(models.User, {
                foreignKey: "user_id_2",
                targetKey: "id",
                as: "user_2",
            });
            Friendship.belongsTo(models.Status, {
                foreignKey: "status",
                targetKey: "id",
            });
        }
    }

    Friendship.init(
        {
            user_id_1: DataTypes.INTEGER,
            user_id_2: DataTypes.INTEGER,
            status: DataTypes.INTEGER,
        },
        {
            sequelize,
            modelName: "Friendship",
        }
    );
    return Friendship;
};
