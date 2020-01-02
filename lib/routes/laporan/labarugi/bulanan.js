"use strict";

const express = require('express');
const router = express.Router();

const common = require('../../../common');

const modelLRB = require('../../../models/laporan/labarugibulanan');

router.get('/', function(req, res, next){
  let data = {
    sessionUsers : req.session.users,
    title : 'Bulanan',
    filejs : '/komodojs'+req.originalUrl+'.js',
    dmy1: common.date(),
    dmy2: common.date(),
  }
  res.render('laporan/akuntansi/labarugi/bulanan.html', data);
});

router.get('/pendapatanJson', [modelLRB.dataPendapatan],function(req, res, next){
  let draw = parseInt(req.query.draw);
  let response = {
    "draw" :draw,
    "recordsTotal": modelLRB.countPendapatan[0].count,
    "recordsFiltered": modelLRB.countPendapatan[0].count,
    "data": modelLRB.listPendapatan
  };
  res.json(response);
});

router.get('/bebanJson', [modelLRB.dataBiaya], function(req, res, next){
  let draw = parseInt(req.query.draw);
  let response = {
    "draw" :draw,
    "recordsTotal": modelLRB.countBiaya[0].count,
    "recordsFiltered": modelLRB.countBiaya[0].count,
    "data": modelLRB.listBiaya
  };
  res.json(response);
});

router.get('/saldoAkun/:akun_id/:tipe_akun/:kode_akun', [modelLRB.saldoAwal], function(req, res, next){
  let data = {
    saldo : 0,
  }
  res.json(data);
});

module.exports = router;
