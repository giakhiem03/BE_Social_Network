"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Message extends Model {
        static associate(models) {
            Message.belongsTo(models.ChatRoom, {
                foreignKey: "room_chat_id",
                targetKey: "id",
                as: "room_chat",
            });
            Message.belongsTo(models.User, {
                foreignKey: "user_id",
                targetKey: "id",
            });
        }
    }

    Message.init(
        {
            room_chat_id: DataTypes.INTEGER,
            user_id: DataTypes.INTEGER,
            content: DataTypes.TEXT,
            image: DataTypes.BLOB("medium"),
        },
        {
            sequelize,
            modelName: "Message",
        }
    );
    return Message;
};
