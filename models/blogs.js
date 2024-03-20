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
      this.hasMany(models.Documents, {
        foreignKey: 'reference_id', // Assuming reference_id is the foreign key in the Documents table referencing the Blogs table
        scope: {
          reference_type: 'blogs', // Assuming reference_type is the column specifying the type of reference
        },
        as: 'documents', // Alias to access documents associated with a blog
      });
    }
  }
  Blogs.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    author: DataTypes.STRING,
    title: DataTypes.STRING,
    content: DataTypes.TEXT,
    category: DataTypes.ENUM('news','insight','all_about_carbon'),
    meta_title: DataTypes.STRING,
    meta_description: DataTypes.STRING,
    project_summary: DataTypes.TEXT,
  }, {
    sequelize,
    modelName: 'Blogs',
  });
  return Blogs;
};