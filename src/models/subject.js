'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Subject extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Subject.hasMany(models.ClassGroup);
    }
  }
  Subject.init({
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    majorId: DataTypes.STRING,
    teacherId: DataTypes.STRING,
    isClosed: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Subject',
    freezeTableName: true
  });
  return Subject;
};