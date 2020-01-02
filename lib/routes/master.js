"use strict";

const express = require('express');
const router = express.Router();

const akuntansi = require('./master/akuntansi');
const admin = require('./master/admin');
const member = require('./master/member');
const suplier = require('./master/suplier');

router.get('/',function(req, res, next){
  //res.send('Master Home Page');
  //res.render('master/index.html', {user:"James"});
  res.render('page_not_found.html');
  //throw new Error("BROKEN");
});

router.use('/akuntansi', akuntansi);
router.use('/admin', admin);
router.use('/member', member);
router.use('/suplier', suplier);

module.exports = router;
