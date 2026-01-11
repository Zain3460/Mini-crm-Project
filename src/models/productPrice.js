module.exports = (sequelize, DataTypes) => {
  const ProductPrice = sequelize.define('ProductPrice', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'product_id'
    },
    priceType: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'price_type',
      defaultValue: 'RETAIL' // RETAIL, WHOLESALE, VIP vb.
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    currency: {
      type: DataTypes.STRING,
      defaultValue: 'TRY'
    }
  }, {
    tableName: 'product_prices',
    timestamps: true,
    underscored: true
  });

  return ProductPrice;
};
