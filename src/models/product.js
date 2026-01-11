module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define('Product', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    sku: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    stockQuantity: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    trackStock: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    unit: {
      type: DataTypes.STRING,
      defaultValue: 'adet'
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    tableName: 'products',
    timestamps: true
  });

  return Product;
};
