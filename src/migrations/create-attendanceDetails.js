'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('AttendanceDetails', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      studentAttendIds: {
        type: Sequelize.STRING
      },
      absentStudentIds: {
        type: Sequelize.STRING
      },
      lateStudentIds: {
        type: Sequelize.STRING
      },
      lieStudentIds: {
        type: Sequelize.STRING
      },
      classGroupId: {
        type: Sequelize.STRING
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
    await queryInterface.dropTable('AttendanceDetails');
  }
};