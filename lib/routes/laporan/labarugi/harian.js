"use strict";

const express = require('express');
const router = express.Router();

const common = require('../../../common');

const modelLR = require('../../../models/laporan/labarugi');

router.get('/', function(req, res, next){
  let data = {
    sessionUsers : req.session.users,
    title : 'Harian',
    filejs : '/komodojs'+req.originalUrl+'.js',
    dmy1: common.date(),
    dmy2: common.date(),
  }
  res.render('laporan/akuntansi/labarugi/harian.html', data);
});

router.get('/pendapatanJson', [modelLR.dataPendapatan],function(req, res, next){
  let draw = parseInt(req.query.draw);
  let response = {
    "draw" :draw,
    "recordsTotal": modelLR.countPendapatan[0].count,
    "recordsFiltered": modelLR.countPendapatan[0].count,
    "data": modelLR.listPendapatan
  };
  res.json(response);
});

router.get('/bebanJson', [modelLR.dataBiaya], function(req, res, next){
  let draw = parseInt(req.query.draw);
  let response = {
    "draw" :draw,
    "recordsTotal": modelLR.countBiaya[0].count,
    "recordsFiltered": modelLR.countBiaya[0].count,
    "data": modelLR.listBiaya
  };
  res.json(response);
});

router.get('/saldoAkun/:akun_id/:tipe_akun/:kode_akun', [modelLR.saldoAwal], function(req, res, next){
  let data = {
    saldo : 0,
  }
  res.json(data);
});

router.get('/saldoMutasiAkun/:akun_id/:tipe_akun/:kode_akun', [modelLR.saldoMutasi], function(req, res, next){
  let data = {
    saldo : 0,
  }
  res.json(data);
});

module.exports = router;
