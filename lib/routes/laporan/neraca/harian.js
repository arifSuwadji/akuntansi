"use strict";

const express = require('express');
const router = express.Router();

const common = require('../../../common');

const modelNeraca = require('../../../models/laporan/neraca');

router.get('/', function(req, res, next){
  let data = {
    sessionUsers : req.session.users,
    title : 'Harian',
    filejs : '/komodojs'+req.originalUrl+'.js',
    dmy1: common.date(),
    dmy2: common.date(),
  }
  res.render('laporan/akuntansi/neraca/harian.html', data);
});

router.get('/aktivaJson', [modelNeraca.dataAktiva],function(req, res, next){
  let draw = parseInt(req.query.draw);
  let response = {
    "draw" :draw,
    "recordsTotal": modelNeraca.countAktiva[0].count,
    "recordsFiltered": modelNeraca.countAktiva[0].count,
    "data": modelNeraca.listAktiva
  };
  res.json(response);
});

router.get('/pasivaJson', [modelNeraca.dataPasiva], function(req, res, next){
  let draw = parseInt(req.query.draw);
  let response = {
    "draw" :draw,
    "recordsTotal": modelNeraca.countPasiva[0].count,
    "recordsFiltered": modelNeraca.countPasiva[0].count,
    "data": modelNeraca.listPasiva
  };
  res.json(response);
});

router.get('/saldoAkun/:akun_id/:tipe_akun/:kode_akun', [modelNeraca.saldoAwal], function(req, res, next){
  let data = {
    saldo : 0,
  }
  res.json(data);
});

router.get('/saldoMutasiAkun/:akun_id/:tipe_akun/:kode_akun', [modelNeraca.saldoMutasi],function(req, res, next){
  let data = {
    saldo : 0,
  }
  res.json(data);
});

module.exports = router;
