'use strict';
const {
  Model
} = require('sequelize');
const {hash_password} = require('../helpers/hash')
module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.Clients, {
        foreignKey: "user_id",
        constraints: false,
      });
      this.hasMany(models.Careers, {
        foreignKey: "user_id",
        constraints: false,
        as: "user"
      });
    }
  }
  Users.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        args: true,
        msg: 'Email must be unique',
      },
      validate: {
        notNull: {
          msg: 'Email harus diisi',
        },
        isEmail: {
          msg: 'Format email tidak valid',
        },
        notEmpty: {
          msg: 'Email harus diisi',
        },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Nama lengkap harus diisi',
        },
        notEmpty: {
          msg: 'Nama lengkap harus diisi',
        },
      },
    },
    phone: {
      type: DataTypes.STRING,
    },
    address: {
      type: DataTypes.TEXT,
    },
    role: {
      allowNull: false,
      type: DataTypes.ENUM("admin", "client", "applicant")
    }
  }, {
    hooks: {
      beforeCreate: (user) => {
        const currentDate = new Date();
        const currentTimeString = currentDate.toLocaleTimeString();
        user.password = hash_password(currentTimeString)
      }
  },
    sequelize,
    modelName: 'Users',
  });
  return Users;
};