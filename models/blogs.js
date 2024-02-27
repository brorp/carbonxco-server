'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Blogs extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
    }
  }
  Blogs.init({
    author: DataTypes.STRING,
    title: DataTypes.STRING,
    content: DataTypes.TEXT,
    category: DataTypes.ENUM('news','insight','all_about_carbon'),
    slug: DataTypes.TEXT,
    meta_tag: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Blogs',
  });
  return Blogs;
};