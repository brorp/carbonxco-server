'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Projects extends Model {
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
          reference_type: 'projects', // Assuming reference_type is the column specifying the type of reference
        },
        as: 'documents', // Alias to access documents associated with a blog
      });
    }
  }
  Projects.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    start_date: DataTypes.BIGINT,
    location: DataTypes.STRING,
    area: DataTypes.STRING,
    area_description: DataTypes.TEXT,
    ecosystem_type: DataTypes.TEXT,
    community: DataTypes.TEXT,
    main_goal: DataTypes.TEXT,
    key_factor: DataTypes.TEXT,
    other: DataTypes.TEXT,
    sdg: DataTypes.ARRAY(DataTypes.STRING),
    status: DataTypes.ENUM("Origination", "Due dilligence", "Development", "Implementation", "Issuance"),
    button_text: DataTypes.STRING,
    button_link_to: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Projects',
  });
  return Projects;
};