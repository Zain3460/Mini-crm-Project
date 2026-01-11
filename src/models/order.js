module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define('Order', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },

    customerId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'customer_id'
    },

    guestName: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'guest_name'
    },
    guestPhone: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'guest_phone'
    },
    guestAddress: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'guest_address'
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'product_id'
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },

    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'PENDING'
    },

    // 🔥 DECIMAL doğru kullanım:
    totalAmount: {
  type: DataTypes.FLOAT,
  allowNull: true,
  field: 'total_amount'
}

  }, {
    tableName: 'orders',
    underscored: true
  });

  return Order;

  
};
