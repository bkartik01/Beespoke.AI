// models/catalog.js
const mongoose = require('mongoose');
//creating the schema for catlog
const catalogSchema = new mongoose.Schema({
  product_id: String,
  Product_category: String,
  Rank: Number,
  brand_name: String,
  product_description: String,
  price: Number,
  image_link: String,
}, { collection: 'catalog' }); // Explicitly specify the collection name

module.exports = mongoose.model('Catalog', catalogSchema);
