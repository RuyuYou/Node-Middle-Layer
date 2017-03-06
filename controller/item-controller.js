const Item = require('../model/item');
const constant = require('../config/constant');
const async = require('async');

class ItemController {
  getAll(req, res, next) {
    async.series({
      items: (done)=> {
        Item.find({})
          .populate('Category')
          .exec(done)
      },
      totalCount: (done)=> {
        Item.count(done);
      }
    },(err,result)=>{
      if(err) {
        return next(err);
      }
      return res.status(constant.httpCode.OK).send(result);
    });
  }

  getOne(req, res, next) {
    Item.findById(req.params.itemId, (err, doc)=> {
      if (err) {
        return next(err);
      }
      if (!doc) {
        return res.sendStatus(constant.httpCode.NOT_FOUND);
      }
      return res.status(constant.httpCode.OK).send(doc);
    });
  }

  create(req, res, next) {
    Item.create(req.body, (err, doc)=> {
      if (err) {
        return next(err);
      }
      return res.status(constant.httpCode.CREATED).send({uri: `items/${doc._id}`});
    });
  }

  delete(req, res, next) {
    Item.findByIdAndRemove(req.params.itemId, (err, doc)=> {
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
    Item.findByIdAndUpdate(req.params.itemId, req.body, (err, doc)=> {
      if (err) {
        return next(err);
      }
      if (!doc) {
        return res.sendStatus(constant.httpCode.NOT_FOUND);
      }
      return res.sendStatus(constant.httpCode.NO_CONTENT);
    })
  }
}

module.exports = ItemController;
