'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // 1) customer_id nullable olsun
    await queryInterface.changeColumn('orders', 'customer_id', {
      type: Sequelize.INTEGER,
      allowNull: true
    });

    // 2) guest alanlarını ekle
    await queryInterface.addColumn('orders', 'guest_name', {
      type: Sequelize.STRING,
      allowNull: true
    });

    await queryInterface.addColumn('orders', 'guest_phone', {
      type: Sequelize.STRING,
      allowNull: true
    });

    await queryInterface.addColumn('orders', 'guest_address', {
      type: Sequelize.STRING,
      allowNull: true
    });

    // 3) status default PENDING (varsa)
    await queryInterface.changeColumn('orders', 'status', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'PENDING'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('orders', 'guest_address');
    await queryInterface.removeColumn('orders', 'guest_phone');
    await queryInterface.removeColumn('orders', 'guest_name');

    await queryInterface.changeColumn('orders', 'customer_id', {
      type: Sequelize.INTEGER,
      allowNull: false
    });

    await queryInterface.changeColumn('orders', 'status', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'pending'
    });
  }
};
