const { Product } = require('../models');

class ProductService {
  async getAllProducts() {
    return await Product.findAll();
  }

  async getProductById(id) {
    return await Product.findByPk(id);
  }

  async createProduct(data) {
    return await Product.create(data);
  }

  async updateProduct(id, data) {
    const product = await Product.findByPk(id);
    if (!product) return null;
    return await product.update(data);
  }

  async deleteProduct(id) {
    const product = await Product.findByPk(id);
    if (!product) return null;
    return await product.destroy();
  }

  async updateStock(id, quantity, type = 'decrease') {
    const product = await Product.findByPk(id);
    if (!product || !product.trackStock) return product;

    const newQuantity = type === 'decrease' 
      ? product.stockQuantity - quantity 
      : product.stockQuantity + quantity;

    if (newQuantity < 0) {
      throw new Error('Yetersiz stok');
    }

    return await product.update({ stockQuantity: newQuantity });
  }
}

module.exports = new ProductService();
