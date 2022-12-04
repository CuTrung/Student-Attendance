'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SchoolYear extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      SchoolYear.hasMany(models.Student, { foreignKey: 'schoolYearId' });
      SchoolYear.hasMany(models.ClassGroup);
    }
  }
  SchoolYear.init({
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    isGraduated: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'SchoolYear',
    freezeTableName: true,
  });
  return SchoolYear;
};