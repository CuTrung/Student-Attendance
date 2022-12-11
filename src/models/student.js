'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Student extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Student.belongsTo(models.Major, { foreignKey: 'majorId' });
      Student.belongsTo(models.SchoolYear, { foreignKey: 'schoolYearId' });
      Student.hasMany(models.SpecialStudents);
      Student.belongsTo(models.Group, { foreignKey: 'groupId' });
      // Student.belongsToMany(models.ClassGroup, { through: 'Student_ClassGroup', targetKey: 'id' });

      Student.hasMany(models.Student_ClassGroup);
    }
  }
  Student.init({
    fullName: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    isDeleted: DataTypes.INTEGER,
    majorId: DataTypes.STRING,
    schoolYearId: DataTypes.STRING,
    groupId: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Student',
    freezeTableName: true,
  });
  return Student;
};