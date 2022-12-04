'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class RegistrationGroup extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      RegistrationGroup.hasMany(models.ClassGroup)
      RegistrationGroup.belongsToMany(models.Subject, { through: 'ClassGroup', foreignKey: 'registrationGroupId' });

    }
  }
  RegistrationGroup.init({
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    isClosed: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'RegistrationGroup',
    freezeTableName: true
  });
  return RegistrationGroup;
};