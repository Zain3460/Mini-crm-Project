'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const table = 'customers';
    const desc = await queryInterface.describeTable(table);

    // SQLite'da kolon yoksa ekle
    if (!desc.is_active) {
      await queryInterface.addColumn(table, 'is_active', {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      });
    }
  },

  async down(queryInterface) {
    const table = 'customers';
    const desc = await queryInterface.describeTable(table);

    if (desc.is_active) {
      await queryInterface.removeColumn(table, 'is_active');
    }
  }
};
