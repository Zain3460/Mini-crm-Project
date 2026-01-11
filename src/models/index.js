const { Sequelize, DataTypes } = require("sequelize");
const config = require("../config"); // src/config/index.js

// ✅ SQLite dosyasına kesin bağlan
const sequelize = new Sequelize({
  dialect: config.db.dialect,
  storage: config.db.storage,
  logging: config.db.logging ? console.log : false
});

// ✅ Hemen startup'ta nereyi kullandığını yazdır
console.log("CONFIG DB =>", config.db);
console.log("Sequelize opts =>", {
  dialect: sequelize.getDialect(),
  storage: sequelize.options.storage
});

// Modelleri yükle
const Customer = require("./customer")(sequelize, DataTypes);
const Order = require("./order")(sequelize, DataTypes);
const Product = require("./product")(sequelize, DataTypes);
const OrderItem = require("./orderItem")(sequelize, DataTypes);
const ProductPrice = require("./productPrice")(sequelize, DataTypes);

// Eğer ilişki varsa burada kur (örnek)
// Customer.hasMany(Order, { foreignKey: "customerId" });
// Order.belongsTo(Customer, { foreignKey: "customerId" });

module.exports = {
  sequelize,
  Sequelize,
  Customer,
  Order,
  Product,
  OrderItem,
  ProductPrice,
};

// ... model import / init ettikten sonra:

Customer.hasMany(Order, { foreignKey: 'customerId', as: 'orders' });
Order.belongsTo(Customer, { foreignKey: 'customerId', as: 'customer' });

// Order - Product ilişkisi (Çoktan çoğa veya sipariş satırı olarak düşünülebilir, 
// ancak basitlik için siparişe productId ekleyebiliriz veya yeni bir OrderItem modeli kurabiliriz.
// Hoca isterlerine göre şimdilik basit tutalım veya OrderItem ekleyelim.)
// Basitlik için Order tablosuna productId ekleyelim (veya JSON olarak tutulabilir ama DB yapısı için productId daha iyi)
Order.hasMany(OrderItem, { foreignKey: 'orderId', as: 'items' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });

OrderItem.belongsTo(Product, { foreignKey: 'productId', as: 'product' });
Product.hasMany(OrderItem, { foreignKey: 'productId', as: 'orderItems' });
Product.hasMany(ProductPrice, { foreignKey: 'productId', as: 'prices' });
ProductPrice.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

// export etmeden önce bu satırlar çalışmış olmalı
