'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('SpecialStudents', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      studentId: {
        type: Sequelize.STRING
      },
      status: {
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

    // await queryInterface.addConstraint('SpecialStudents', {
    //   fields: ['studentId', 'status'],
    //   type: 'unique',
    //   name: 'specialStudents_unique'
    // });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('SpecialStudents');
  }
};