'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Careers extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Jobs, {
        foreignKey: "job_id",
        constraints: false,
        as: "job"
      });
      this.belongsTo(models.Users, {
        foreignKey: "user_id",
        constraints: false,
        as: "user"
      });
      this.hasMany(models.Documents, {
        foreignKey: 'reference_id', // Assuming reference_id is the foreign key in the Documents table referencing the Blogs table
        scope: {
          reference_type: 'careers', // Assuming reference_type is the column specifying the type of reference
        },
        as: 'documents', // Alias to access documents associated with a blog
      });
    }
  }
  Careers.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    job_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "Jobs",
        key: "id",
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
    },
    user_id:{
      type: DataTypes.INTEGER,
      references: {
        model: "Users",
        key: "id",
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
    },
  }, {
    sequelize,
    modelName: 'Careers',
  });
  return Careers;
};