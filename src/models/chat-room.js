"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class ChatRoom extends Model {
        static associate(models) {
            ChatRoom.belongsTo(models.User, {
                foreignKey: "user_1",
                targetKey: "id",
            });
            ChatRoom.belongsTo(models.User, {
                foreignKey: "user_2",
                targetKey: "id",
            });
        }
    }

    ChatRoom.init(
        {
            room_name: DataTypes.STRING,
            image: DataTypes.BLOB("medium"),
            content: DataTypes.TEXT,
            user_1: DataTypes.INTEGER,
            user_2: DataTypes.INTEGER,
        },
        {
            sequelize,
            modelName: "ChatRoom",
        }
    );
    return ChatRoom;
};
