'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Projects extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Projects.init({
    created_at: DataTypes.BIGINT,
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    start_date: DataTypes.BIGINT,
    location: DataTypes.STRING,
    area: DataTypes.STRING,
    ecosystem_type: DataTypes.TEXT,
    community: DataTypes.TEXT,
    main_goal: DataTypes.TEXT,
    key_factor: DataTypes.TEXT,
    other: DataTypes.TEXT,
    status: DataTypes.ENUM("careers", "projects", "pages", "blogs", "teams")
  }, {
    sequelize,
    modelName: 'Projects',
  });
  return Projects;
};