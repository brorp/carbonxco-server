'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Projects', 'button_text', {
      type: Sequelize.STRING
    })
    await queryInterface.addColumn('Projects', 'button_link_to', {
      type: Sequelize.STRING
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.addColumn('Projects', 'button_link_to')
    await queryInterface.addColumn('Projects', 'button_text')
  }
};
