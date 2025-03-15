"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Message extends Model {
        static associate(models) {
            // define association here
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
