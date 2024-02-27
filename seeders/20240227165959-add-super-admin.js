'use strict';
const { getSalt } = require("../helpers/bcrypt");
module.exports = {
  async up (queryInterface, Sequelize) {
    let data = [{
      name: 'Admin Carbonxco',
      email: 'superadmin@carbonxco.com',
      password: getSalt('Carbon123!'),
      role: "admin",
      createdAt: new Date(),
      updatedAt: new Date()
    }]
    await queryInterface.bulkInsert("Users", data)
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Users", null, {})
  }
};
