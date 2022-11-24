'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ClassGroup extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ClassGroup.hasMany(models.AttendanceDetails);
      ClassGroup.hasMany(models.Code);
      ClassGroup.belongsTo(models.Subject);
    }
  }
  ClassGroup.init({
    subjectId: DataTypes.STRING,
    registrationGroupId: DataTypes.STRING,
    teacherId: DataTypes.STRING,
    schoolYearId: DataTypes.STRING,
    isClosed: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'ClassGroup',
    freezeTableName: true
  });
  return ClassGroup;
};