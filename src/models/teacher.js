'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Teacher extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Teacher.belongsToMany(models.Major, { through: 'Subject', foreignKey: 'teacherId' });
      Teacher.belongsTo(models.Group);
    }
  }
  Teacher.init({
    fullName: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    isDeleted: DataTypes.INTEGER,
    groupId: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Teacher',
    freezeTableName: true
  });
  return Teacher;
};