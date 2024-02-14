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
      this.belongsTo(models.Careers, {
        foreignKey: "user_id",
        constraints: false,
      });
      this.belongsTo(models.Users, {
        foreignKey: "user_id",
        constraints: false,
      });
    }
  }
  Careers.init({
    created_at: DataTypes.BIGINT,
    job_id: {
      type: DataTypes.UUID,
      references: {
        model: "Jobs",
        key: "id",
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
    },
    user_id:{
      type: DataTypes.UUID,
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