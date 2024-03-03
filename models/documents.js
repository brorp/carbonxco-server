'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Documents extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Documents.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    reference_id: DataTypes.UUID,
    reference_type: {
      allowNull: false,
      type: DataTypes.ENUM("careers", "projects", "pages", "blogs", "teams")
    },
    key: DataTypes.STRING,
    file_name: DataTypes.STRING,
    file_type: DataTypes.STRING,
    document_type: DataTypes.STRING
  }, { hooks: {
    beforeCreate: (document) => {
      const currentDate = new Date();
      const currentTimeString = currentDate.toLocaleTimeString();
      document.file_name = getSalt(currentTimeString)
    }
  },
    sequelize,
    modelName: 'Documents',
  });
  return Documents;
};