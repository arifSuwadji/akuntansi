'use strict';

const express = require('express');
const router = express.Router();

const login = require('../controllers/login');

router.route('/')
.get(login.view, function(req, res, next){
  res.json({
    status: 'Failed',
    message: 'Login tidak tersedia'
  });
}).post(login.action, function(req, res, next){
  res.redirect('/login');
});

router.get('/out', login.out);

module.exports = router;
