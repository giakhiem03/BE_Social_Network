"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("User_Reaction_Post", {
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
            content: {
                type: Sequelize.TEXT,
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
        await queryInterface.dropTable("User_Reaction_Post");
    },
};
