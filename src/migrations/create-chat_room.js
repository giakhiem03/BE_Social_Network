"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("ChatRooms", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            room_name: {
                type: Sequelize.TEXT,
            },
            image: {
                type: Sequelize.BLOB("medium"),
            },
            message_id: {
                type: Sequelize.INTEGER,
            },
            user_1: {
                type: Sequelize.INTEGER,
            },
            user_2: {
                type: Sequelize.INTEGER,
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
        await queryInterface.dropTable("ChatRooms");
    },
};
