'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ClassGroup', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      subjectId: {
        type: Sequelize.STRING
      },
      registrationGroupId: {
        type: Sequelize.STRING
      },
      teacherId: {
        type: Sequelize.STRING
      },
      schoolYearId: {
        type: Sequelize.STRING
      },
      showCode: {
        type: Sequelize.STRING
      },
      timeline: {
        type: Sequelize.STRING
      },
      isActive: {
        type: Sequelize.INTEGER
      },
      isClosed: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('ClassGroup');
  }
};