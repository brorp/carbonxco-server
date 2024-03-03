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
      this.hasMany(models.Jobs, {
        foreignKey: "job_id",
        constraints: false,
      });
      this.hasMany(models.Users, {
        foreignKey: "user_id",
        constraints: false,
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