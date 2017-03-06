const Category = require('../model/category');
const Item = require('../model/item');
const constant = require('../config/constant');
const async = require('async');

class CategoryController {
  getAll(req, res, next) {
    async.series({
      items: (done)=> {
        Category.find({}, done);
      },
      totalCount: (done)=> {
        Category.count(done);
      }
    }, (err, result)=> {
      if (err) {
        return next(err);
      }
      return res.status(constant.httpCode.OK).send(result);
    });
  }

  getOne(req, res, next) {
    Category.findById(req.params.categoryId, (err, doc)=> {
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
    Category.create(req.body, (err, doc)=> {
      if (err) {
        return next(err);
      }
      return res.status(constant.httpCode.CREATED).send({uri: `categories/${doc._id}`});
    });
  }

  delete(req, res, next) {
    const category = req.params.categoryId;
    async.waterfall([
      (done)=> {
        Item.findOne({category}, done);
      },
      (docs, done)=> {
        if (docs) {
          done(true, null);
        } else {
          Category.findByIdAndRemove(category, (err, doc)=> {
            if (!doc) {
              return done(false, null);
            }
            done(err, doc);
          });
        }
      }
    ], (err)=> {
      if (err === true) {
        return res.sendStatus(constant.httpCode.BAD_REQUEST);
      }
      if (err === false) {
        return res.sendStatus(constant.httpCode.NOT_FOUND);
      }
      if(err) {
        return next(err);
      }
      return res.sendStatus(constant.httpCode.NO_CONTENT);
    })
  }

  update(req, res, next) {
    Category.findByIdAndUpdate(req.params.categoryId, req.body, (err, doc)=> {
      if (err) {
        return nextd(err);
      }
      if (!doc) {
        return res.sendStatus(constant.httpCode.NOT_FOUND);
      }
      return res.sendStatus(constant.httpCode.NO_CONTENT);
    })
  }
}

module.exports = CategoryController;