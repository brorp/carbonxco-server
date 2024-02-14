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
      // define association here
      this.belongsTo(models.Categories, {
        foreignKey: "category_id",
        constraints: false,
      });
    }
  }
  Blogs.init({
    created_at: DataTypes.BIGINT,
    updated_at: DataTypes.BIGINT,
    deleted_at: DataTypes.BIGINT,
    author: DataTypes.STRING,
    content: DataTypes.TEXT,
    category_id: DataTypes.UUID,
    slug: DataTypes.TEXT,
    meta_tag: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Blogs',
  });
  return Blogs;
};