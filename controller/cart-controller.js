const Cart = require('../model/cart');
const async = require('async');
const constant = require('../config/constant');

const mapItemToUri = (items)=> {
  return items.map(({count, item})=> {
    return {uri: `items/${item}`, count};
  });
};

class CartController {
  getAll(req, res, next) {
    async.series({
      items: (done)=> {
        Cart.find({}, (err, docs)=> {
          if (err) {
            return next(err);
          }
          let carts = docs.map((doc)=> {
            let cart = doc.toJSON();
            cart.items = mapItemToUri(cart.items);
            return cart;
          });
          done(null, carts);
        });
      },
      totalCount: (done)=> {
        Cart.count(done);
      }
    }, (err, result)=> {
      if (err) {
        return next(err);
      }
      return res.status(constant.httpCode.OK).send(result);
    });
  }

  getOne(req, res, next) {
    Cart.findById(req.params.cartId, (err, doc)=> {
      if (err) {
        return next(err);
      }
      if (!doc) {
        return res.sendStatus(constant.httpCode.NOT_FOUND);
      }
      let data = doc.toJSON();
      let items = doc.items;
      data.items = mapItemToUri(items);
      return res.status(constant.httpCode.OK).send(data);
    });
  }

  create(req, res, next) {
    Cart.create(req.body, (err, doc)=> {
      if (err) {
        return next(err);
      }
      return res.status(constant.httpCode.CREATED).send({uri: `carts/${doc._id}`});
    });
  }

  delete(req, res, next) {
    Cart.findByIdAndRemove(req.params.cartId, (err, doc)=> {
      if (err) {
        return next(err);
      }
      if (!doc) {
        return res.sendStatus(constant.httpCode.NOT_FOUND);
      }
      return res.sendStatus(constant.httpCode.NO_CONTENT);
    });
  }

  update(req, res, next) {
    Cart.findByIdAndUpdate(req.params.cardId, req.body, (err, doc)=> {
      if (err) {
        return next(err);
      }
      if (!doc) {
        return res.sendStatus(constant.httpCode.NOT_FOUND);
      }
      return res.status(constant.httpCode.NO_CONTENT).send(doc);
    });
  }
}

module.exports = CartController;