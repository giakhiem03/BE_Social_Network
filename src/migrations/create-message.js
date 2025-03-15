"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("Messages", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            room_chat_id: {
                type: Sequelize.INTEGER,
            },
            user_id: {
                type: Sequelize.INTEGER,
            },
            content: {
                type: Sequelize.TEXT,
            },
            image: {
                type: Sequelize.BLOB("medium"),
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("Messages");
    },
};
