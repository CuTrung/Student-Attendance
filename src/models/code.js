'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Code extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Code.belongsTo(models.ClassGroup);
    }
  }
  Code.init({
    uuid: DataTypes.STRING,
    showId: DataTypes.STRING,
    status: DataTypes.STRING,
    classGroupId: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Code',
    freezeTableName: true,
  });
  return Code;
};