'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // 1) Eski tabloyu yedekle
    await queryInterface.renameTable('orders', 'orders_old');

    // 2) Yeni orders tablosunu DOĞRU şema ile oluştur
    await queryInterface.createTable('orders', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },

      customer_id: {
        type: Sequelize.INTEGER,
        allowNull: true
      },

      guest_name: {
        type: Sequelize.STRING,
        allowNull: true
      },

      guest_phone: {
        type: Sequelize.STRING,
        allowNull: true
      },

      guest_address: {
        type: Sequelize.STRING,
        allowNull: true
      },

      status: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'PENDING'
      },

      total_amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
      },

      created_at: {
        type: Sequelize.DATE,
        allowNull: false
      },

      updated_at: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

    // 3) Eski verileri taşı
    await queryInterface.sequelize.query(`
      INSERT INTO orders (id, customer_id, status, total_amount, created_at, updated_at)
      SELECT id, customer_id, status, total_amount, created_at, updated_at
      FROM orders_old
    `);

    // 4) Eski tabloyu sil
    await queryInterface.dropTable('orders_old');
  },

  async down(queryInterface, Sequelize) {
    throw new Error('Down migration not supported for recreate-orders');
  }
};
