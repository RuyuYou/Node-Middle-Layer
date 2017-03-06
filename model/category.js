const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categorySChema = new Schema({
  name: String
});

const Category = mongoose.model('Category', categorySChema);

module.exports = Category;