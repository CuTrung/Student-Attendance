'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Major extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Major.belongsTo(models.Department);
      Major.belongsToMany(models.Subject, { through: 'Major_Subject', foreignKey: 'majorId' });
      Major.hasMany(models.Student, { foreignKey: 'majorId' });
    }
  }
  Major.init({
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    isClosed: DataTypes.INTEGER,
    departmentId: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Major',
    freezeTableName: true
  });
  return Major;
};