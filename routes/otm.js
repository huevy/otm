var express = require('express');
var Message = require('../models/message');
var bforce = require('../anti-ddos');
var router = express.Router();

router.get('/', pageTitle('Сервис одноразовых сообщений'));
router.get('/m/*', pageTitle('Здесь есть секретное сообщение'));
router.post('/read', pageTitle('Вы читаете секретное сообщение'));
router.post('/message', pageTitle('Секретное сообщение'));
var titleNotFound = 'Здесь ничего нет';


function pageTitle(title) {
  return function(req, res, next) {
    res.locals.title = title;
    next();
  };
}

router.get('/', function(req, res) {
  res.render('otm/form');
});

router.get('/m/:id',
  bforce.readProtection.prevent,
  function(req, res) {
    Message.findOne({
      _id: req.params.id,
      isRead: false,
    }, function(err, doc) {
      if (err) {
        res.render('error', {
          message: err.message,
          error: {}
        });
        return;
      }
      if (!doc) {
        res.status(404);
        res.render('otm/404', {
          title: titleNotFound
        });
        return;
      } else {
        res.render('otm/prologue', {
          id: req.params.id
        });
      }
    });
  });

router.post('/read',
  bforce.readProtection.prevent,
  function(req, res) {
    var id = req.body.id;
    Message.findOne({
      _id: id,
      isRead: false,
    }, function(err, doc) {
      if (err) {
        res.render('error', {
          message: err.message,
          error: {}
        });
        return;
      }
      if (!doc) {
        res.status(404);
        res.render('otm/404', {
          title: titleNotFound
        });
        return;
      } else {
        doc.isRead = true;
        doc.save(function(err) {
          if (err) {
            res.render('error', {
              message: err.message,
              error: {}
            });
            return;
          }
          res.render('otm/read', {
            doc: doc
          });
        });
      }
    });
  });

router.post('/message',
  bforce.writeProtection.prevent,
  function(req, res) {
    var doc = new Message({
      text: req.body.text
    });
    doc.save(function(err, doc) {
      if (err) {
        res.render('error', {
          message: err.message,
          error: {}
        });
        return;
      }
      res.redirect('/m/' + doc.id);
    });
  });

module.exports = router;