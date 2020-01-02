"use strict";

const express = require('express');
const router = express.Router();

const common = require('../common');

router.get('/',function(req, res, next){
  let data = {
    sessionUsers : req.session.users,
    title : 'Dashboard',
    dmy1: common.date(),
    dmy2: common.date(),
  }
  res.render('dashboard.html', data);
});

module.exports = router;
