"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class ChatRoom extends Model {
        static associate(models) {
            ChatRoom.belongsTo(models.User, {
                foreignKey: "user_1",
                targetKey: "id",
                as: "user1",
            });
            ChatRoom.belongsTo(models.User, {
                foreignKey: "user_2",
                targetKey: "id",
                as: "user2",
            });
            ChatRoom.hasMany(models.Message, {
                foreignKey: "room_chat_id",
                as: "message",
            });
        }
    }

    ChatRoom.init(
        {
            room_name: DataTypes.STRING,
            image: DataTypes.BLOB("medium"),
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
