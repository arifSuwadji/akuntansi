"use strict";

const express = require('express');
const router = express.Router();

const common = require('../../../common');

const modelNeracaB = require('../../../models/laporan/neracabulanan');

router.get('/', function(req, res, next){
  let data = {
    sessionUsers : req.session.users,
    title : 'Bulanan',
    filejs : '/komodojs'+req.originalUrl+'.js',
    dmy1: common.date(),
    dmy2: common.date(),
  }
  res.render('laporan/akuntansi/neraca/bulanan.html', data);
});

router.get('/aktivaJson', [modelNeracaB.dataAktiva],function(req, res, next){
  let draw = parseInt(req.query.draw);
  let response = {
    "draw" :draw,
    "recordsTotal": modelNeracaB.countAktiva[0].count,
    "recordsFiltered": modelNeracaB.countAktiva[0].count,
    "data": modelNeracaB.listAktiva
  };
  res.json(response);
});

router.get('/pasivaJson', [modelNeracaB.dataPasiva], function(req, res, next){
  let draw = parseInt(req.query.draw);
  let response = {
    "draw" :draw,
    "recordsTotal": modelNeracaB.countPasiva[0].count,
    "recordsFiltered": modelNeracaB.countPasiva[0].count,
    "data": modelNeracaB.listPasiva
  };
  res.json(response);
});

router.get('/saldoAkun/:akun_id/:tipe_akun/:kode_akun', [modelNeracaB.saldoAwal], function(req, res, next){
  let data = {
    saldo : 0,
  }
  res.json(data);
});

module.exports = router;
