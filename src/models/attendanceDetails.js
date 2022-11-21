'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class AttendanceDetails extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      AttendanceDetails.belongsTo(models.ClassGroup);
    }
  }
  AttendanceDetails.init({
    studentAttendIds: DataTypes.STRING,
    absentStudentIds: DataTypes.STRING,
    lateStudentIds: DataTypes.STRING,
    lieStudentIds: DataTypes.STRING,
    classGroupId: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'AttendanceDetails',
    freezeTableName: true
  });
  return AttendanceDetails;
};