'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Student_ClassGroupVirtual', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      studentId: {
        type: Sequelize.STRING
      },
      classGroupId: {
        type: Sequelize.STRING
      },
      timeline: {
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

    // await queryInterface.addConstraint('Student_ClassGroupVirtual', {
    //   fields: ['studentId', 'classGroupId', 'timeline'],
    //   type: 'unique',
    //   name: 'student_classGroupVirtual_unique'
    // });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Student_ClassGroupVirtual');
  }
};