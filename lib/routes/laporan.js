"use strict";

const express = require('express');
const router = express.Router();

const common = require('../common');

const kas = require('./laporan/kas');
const akuntansi = require('./laporan/akuntansi');
const pembelian = require('./laporan/pembelian');

router.get('/', function(req, res, next){
  res.sender('page_not_found.html');
});

router.use('/kas', kas);
router.use('/akuntansi', akuntansi);
router.use('/pembelian', pembelian);

module.exports = router;
