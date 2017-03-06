const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const itemSchema = new Schema({
  name: String,
  price: Number,
  category: {
    type: Schema.ObjectId,
    ref: 'Category'
  }
});

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;