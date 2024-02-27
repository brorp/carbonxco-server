'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Jobs extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.Careers, {
        foreignKey: "job_id",
        constraints: false,
      });
      this.hasMany(models.Users, {
        foreignKey: "user_id",
        constraints: false,
      });
    }
  }
  Jobs.init({
    title: DataTypes.STRING,
    type: DataTypes.STRING,
    location: DataTypes.STRING,
    requirement: DataTypes.ARRAY(DataTypes.STRING),
    qualification: DataTypes.ARRAY(DataTypes.STRING),
  }, {
    sequelize,
    modelName: 'Jobs',
  });
  return Jobs;
};