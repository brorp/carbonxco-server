'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Clients extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Users, {
        foreignKey: "user_id",
        constraints: false,
      });
    }
  }
  Clients.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    user_id: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: "Users",
        key: "id",
      },
      onUpdate: "cascade",
      onDelete: "cascade",
    },
    subject: {
      type: DataTypes.STRING
    },
    body: {
      type: DataTypes.TEXT
    },
  }, {
    sequelize,
    modelName: 'Clients',
  });
  return Clients;
};