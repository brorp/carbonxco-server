'use strict';
const {
  Model
} = require('sequelize');
const {v4: uuidv4} = require('uuid');
const {Sequelize} = require("sequelize")
module.exports = (sequelize, DataTypes) => {
  class Faqs extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Faqs.init({
    id: {
      type: Sequelize.UUID,
      defaultValue: DataTypes.UUIDV4, // Sequelize will generate a UUID for you, but you can use your own if you want
      allowNull: false,
      unique: true,
      primaryKey: true
    },
    question: DataTypes.STRING,
    answer: DataTypes.TEXT
  }, {
    hooks: {
      beforeCreate: (instance) => {
        // Generate a random UUID using the uuid package
        instance.id = uuidv4();
      },
    },
    sequelize,
    modelName: 'Faqs',
  });
  return Faqs;
};