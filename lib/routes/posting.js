"use strict";

const express = require('express');
const router = express.Router();

const postAction = require('../controllers/posting');

router.get('/',function(req, res, next){
  res.json({
    status: 'Failed',
    message: 'Upps...Posting'
  })
});

router.get('/transaksi/jurnal', [postAction.jurnal],function(req, res, next){
  res.json({
    status: 'Success',
    message: 'Posting Transaksi Berhasil',
  });
});

module.exports = router;
