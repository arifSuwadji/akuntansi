"use strict";

const express = require('express');
const router = express.Router();

const common = require('../../common');
const config = require('../../config');

const kasControl = require('../../controllers/laporan/kas');
const modelJurnal = require('../../models/laporan/jurnal');

router.get('/kas_kecil', function(req, res, next){
  let data = {
    sessionUsers : req.session.users,
    title : 'Kas Kecil',
    titleKas: config.laporan.kode_kas_kecil+' - '+config.laporan.nama_kas_kecil,
    filejs : '/komodojs'+req.originalUrl+'.js',
    dmy1: common.date(),
    dmy2: common.date(),
  }
  res.render('laporan/kas/kas_kecil.html', data);
});

router.get('/kasKecilJson', [modelJurnal.kasData], function(req, res, next){
  let draw = parseInt(req.query.draw);
  let response = {
    "draw" :draw,
    "recordsTotal": modelJurnal.kasCount[0].count,
    "recordsFiltered": modelJurnal.kasCount[0].count,
    "data": modelJurnal.kasList
  };
  res.json(response);
});

router.get('/kas_utama', kasControl.utama);
router.get('/kasUtamaJson', kasControl.dataUtama);

module.exports = router;
