'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Teams extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Teams.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    created_at: DataTypes.BIGINT,
    name: DataTypes.STRING,
    position: DataTypes.STRING,
    description: DataTypes.TEXT,
    link: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Teams',
  });
  return Teams;
};