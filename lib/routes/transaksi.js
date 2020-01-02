"use strict";

const express = require('express');
const router = express.Router();

const common = require('../common');

const modelJurnal = require('../models/transaksi/jurnal');
const modelFaktur = require('../models/transaksi/nomor_faktur');
const modelAkun = require('../models/master/akun');
const kas = require('../controllers/transaksi/kas');
const depositControl = require('../controllers/transaksi/deposit');
const pembayaranControl = require("../controllers/transaksi/pembayaran");
const pembelianControl = require("../controllers/transaksi/pembelian");
const pembayaranSuplierControl = require("../controllers/transaksi/pembayaranPembelian");
const cetakJurnalControl = require('../controllers/transaksi/cetakJurnal');

router.get('/',function(req, res, next){
  //res.send('Master Home Page');
  //res.render('master/index.html', {user:"James"});
  res.render('page_not_found.html');
  //throw new Error("BROKEN");
});

router.route('/kas/:kode')
.get([modelFaktur.dataFaktur, modelAkun.akunSelect], function(req, res, next){
  let titleKas = "Kas Masuk";
  let urlP = req.originalUrl.split(/\?/);
  let urlJ = '/transaksi/kasJson/KM';
  let urlD = '/transaksi/deleteTmp/KM';
  if(req.params.kode == "KK"){
    titleKas = "Kas Keluar";
    urlJ = '/transaksi/kasJson/KK';
    urlD = '/transaksi/deleteTmp/KK';
  }
  let data = {
    sessionUsers : req.session.users,
    title : titleKas,
    filejs : '/komodojs/transaksi/kas.js',
    dmy1: req.query.dmy1,
    dmy2: req.query.dmy1,
    noFaktur: modelFaktur.noFaktur[0].nf,
    results: modelAkun.select,
    urlPost: urlP[0],
    urlJson: urlJ,
    urlDel: urlD,
  }
  res.render('transaksi/kas.html', data);
}).post([kas.add],function(req, res, next){
  res.json({
    status: 'Failed',
    message: 'Koneksi database terputus'
  });
});

router.get('/kasJson/:kode', [modelJurnal.tmp], function(req, res, next){
  let draw = parseInt(req.query.draw);
  let response = {
    "draw" :draw,
    "recordsTotal": modelJurnal.tmpCount[0].count,
    "recordsFiltered": modelJurnal.tmpCount[0].count,
    "data": modelJurnal.tmpList
  };
  res.json(response);
});

router.post('/deleteTmp/:kode', [kas.delTmp], function(req, res, next){
  res.json({
    status: 'Failed',
    message: 'Koneksi database terputus'
  });
});

router.route('/jurnal/:kode')
.get([modelFaktur.dataFaktur,modelAkun.akunSelect], function(req, res, next){
  let urlP = req.originalUrl.split(/\?/);
  let urlJ = '/transaksi/kasJson/'+req.params.kode;
  let urlD = '/transaksi/deleteTmp/'+req.params.kode;
  let data = {
    sessionUsers : req.session.users,
    title : 'Jurnal',
    filejs : '/komodojs/transaksi/jurnal.js',
    dmy1: req.query.dmy1,
    dmy2: req.query.dmy1,
    noFaktur: modelFaktur.noFaktur[0].nf,
    results: modelAkun.select,
    urlPost: urlP[0],
    urlJson: urlJ,
    urlDel: urlD,
  }
  res.render('transaksi/jurnal.html', data);
}).post([kas.add],function(req, res, next){
  res.json({
    status: 'failed',
    message: 'Koneksi database terputus'
  });
})

router.route('/deposit').get(depositControl.index).post(depositControl.update);
router.route('/deposit/editTipe/:idDeposit/:idJurnal').get(depositControl.editTipe).post(depositControl.actionEditTipe);
router.route('/depositJson').get(depositControl.data);
router.route('/depositJson/:idDeposit').get(depositControl.dataById);
router.route('/pembayaran_hutang').get(pembayaranControl.index).post(pembayaranControl.action);
router.route('/pembayaran_memberJson').get(pembayaranControl.dataMember);
router.route('/pembayaran_fakturJson').get(pembayaranControl.dataFaktur);
router.route('/pembayaran_saldoMember/:memberID').get(pembayaranControl.saldoMember);
router.route('/pembayaran_akunJson').get(pembayaranControl.akun);
router.route('/pembayaran_getFaktur/:kode/:dmy1').get(pembayaranControl.faktur);
router.route('/pembelian').get(pembelianControl.index).post(pembelianControl.action);
router.route('/pembelian_suplierJson').get(pembelianControl.dataSuplier);
router.route('/pembelian_getFaktur/:kode/:dmy1').get(pembelianControl.faktur);
router.route('/pembelian_akunJson').get(pembelianControl.akun);
router.route('/pembelian_suplierByID/:suplierID').get(pembelianControl.dataSuplierByID);
router.route('/pembayaran_hutang_suplier').get(pembayaranSuplierControl.index).post(pembayaranSuplierControl.action);
router.route('/pembayaran_hutang_suplierJson').get(pembayaranSuplierControl.dataSuplier);
router.route('/pembayaran_hutang_suplier_getFaktur/:kode/:dmy1').get(pembayaranSuplierControl.faktur);
router.route('/pembayaran_hutang_suplier_akunJson').get(pembayaranSuplierControl.akun);
router.route('/pembayaran_hutang_suplierByID/:suplierID').get(pembayaranSuplierControl.dataSuplierByID);
router.route('/pembayaran_hutang_dataPembelianJson').get(pembayaranSuplierControl.dataPembelianBySuplier);
router.route('/cetak_jurnal').get(cetakJurnalControl.index);
router.route('/cetakJurnalJson').get(cetakJurnalControl.data);
router.route('/printJurnal/:jenisTransaksi/:idJurnal').get(cetakJurnalControl.printJurnal);
router.route('/printRincianJurnal/:jenisTransaksi/:idJurnal').get(cetakJurnalControl.printRincianJurnal);

module.exports = router;
