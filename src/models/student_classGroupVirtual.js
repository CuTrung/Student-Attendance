'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Student_ClassGroupVirtual extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Student_ClassGroupVirtual.init({
    studentId: DataTypes.STRING,
    classGroupId: DataTypes.STRING,
    timeline: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Student_ClassGroupVirtual',
    freezeTableName: true
  });
  return Student_ClassGroupVirtual;
};