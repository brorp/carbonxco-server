'use strict';
/** @type {import('sequelize-cli').Migration} */
const {hash_password} = require('../helpers/hash')
const {uuid} = require('uuidv4')
module.exports = {
  async up (queryInterface, Sequelize) {
    let data = [{
      id: uuid(),
      name: 'Admin Carbonxco',
      email: 'superadmin@carbonxco.com',
      password: hash_password('Carbon123!'),
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
