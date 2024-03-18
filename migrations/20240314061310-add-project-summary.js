'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Blogs', 'project_summary', {
      type: Sequelize.TEXT,
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Blogs', 'project_summary')
  }
};
