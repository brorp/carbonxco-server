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
      this.hasMany(models.Documents, {
        foreignKey: 'reference_id', // Assuming reference_id is the foreign key in the Documents table referencing the Blogs table
        scope: {
          reference_type: 'teams', // Assuming reference_type is the column specifying the type of reference
        },
        as: 'documents', // Alias to access documents associated with a blog
      });
    }
  }
  Teams.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
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