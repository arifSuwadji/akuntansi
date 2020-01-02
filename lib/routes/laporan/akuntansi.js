"use strict";

const express = require('express');
const router = express.Router();

const common = require('../../common');

const modelJurnal = require('../../models/laporan/jurnal');
const modelAkun = require('../../models/master/akun');
const modelBb = require('../../models/laporan/bukubesar');


const neraca = require('./neraca');
const labarugi = require('./labarugi');

const jurnalControl = require('../../controllers/laporan/jurnal');

router.get('/jurnal', function(req, res, next){
  let data = {
    sessionUsers : req.session.users,
    title : 'Jurnal',
    filejs : '/komodojs'+req.originalUrl+'.js',
    dmy1: common.date(),
    dmy2: common.date(),
  }
  res.render('laporan/akuntansi/jurnal.html', data);
});

router.get('/jurnalJson', modelJurnal.dataJurnal, function(req, res, next){
  let draw = parseInt(req.query.draw);
  let response = {
    "draw" :draw,
    "recordsTotal": modelJurnal.countJurnal[0].count,
    "recordsFiltered": modelJurnal.countJurnal[0].count,
    "data": modelJurnal.listJurnal
  };
  res.json(response);
});

router.get('/bukubesar', [modelAkun.akunSelect], function(req, res, next){
  let data = {
    sessionUsers : req.session.users,
    title : 'Buku Besar',
    filejs : '/komodojs'+req.originalUrl+'.js',
    results: modelAkun.select,
    dmy1: common.date(),
    dmy2: common.date(),
  }
  res.render('laporan/akuntansi/bukubesar.html', data);
});

router.get('/bukubesarJson', modelBb.bbData, function(req, res, next){
  let draw = parseInt(req.query.draw);
  let response = {
    "draw" :draw,
    "recordsTotal": modelBb.bbCount[0].count,
    "recordsFiltered": modelBb.bbCount[0].count,
    "data": modelBb.bbList
  };
  res.json(response);
});

router.get('/jurnalJson/:idJurnal', jurnalControl.byId);

router.use('/neraca', neraca);
router.use('/labarugi', labarugi);

module.exports = router;
