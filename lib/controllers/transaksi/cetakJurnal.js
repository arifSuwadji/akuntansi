"use strict";

const common = require("../../common");
const config = require("../../config.json");
const connection = require("../../db");

const printControl = require("./cetak/print");
const modelJurnal = require("../../models/transaksi/jurnalTransaksi");

exports.index = function (req, res, next) {
  // body...
  let data = {
    sessionUsers : req.session.users,
    title : 'Cetak Jurnal',
    titleKas : 'Data Cetak',
    filejs : '/komodojs/transaksi/cetakJurnal.js',
    dmy1: req.query.dmy1,
    dmy2: req.query.dmy1,
  }
  res.render('transaksi/cetak_jurnal.html', data);
};

exports.data = async function (req, res, next) {
  // body...
  let value = req.query.search.value;
  let tanggal=''; let jenisTransaksi=''; let keterangan='';
  if(value){
    let arrVal = value.split(/\_/);
    tanggal = arrVal[0].split('/').reverse().join('-');
    jenisTransaksi = arrVal[1];
    keterangan = "%"+arrVal[2]+"%";
  }

  if(jenisTransaksi){
    printControl.index(req, res, next);
  }else{
    let draw = parseInt(req.query.draw);
    let response = {
      "draw" :draw,
      "recordsTotal": 0,
      "recordsFiltered": 0,
      "data": []
    };
    res.json(response);
  }

};

exports.printJurnal = async function (req, res, next) {
  // body...
  let dataResponse = [];
  let status = 'success';
  let count  = 0;
  await new Promise(function(resolve, reject) {
    modelJurnal.countDetailByJurnal(req.params.idJurnal, function(err, data){
      if(err){
        common.log("err data print "+data);
        status = 'failed';
        resolve();
      }else{
        count = data;
        resolve();
      }
    })
  });
  await new Promise(function(resolve, reject) {
    modelJurnal.detailByJurnal(req.params.idJurnal, function(err, data){
      if(err){
        common.log("err data print "+data);
        status = 'failed';
        resolve();
      }else{
        dataResponse = data;
        resolve();
      }
    });
  });

  var dt = dataResponse[0].jurnal_ts;
  var month = new Array();
  month[0] = "Januari";
  month[1] = "Februari";
  month[2] = "Maret";
  month[3] = "April";
  month[4] = "Mei";
  month[5] = "Juni";
  month[6] = "Juli";
  month[7] = "Agustus";
  month[8] = "September";
  month[9] = "Oktober";
  month[10] = "November";
  month[11] = "Desember";
  let periode = month[dt.getMonth()];
  let title = 'Jurnal Kas Masuk';
  if(req.params.jenisTransaksi == 'KK'){
    title = 'Jurnal Kas Keluar';
  }else if(req.params.jenisTransaksi == 'JR'){
    title = 'Jurnal Khusus';
  }else if(req.params.jenisTransaksi == 'DP'){
    title = 'Jurnal Deposit';
  }else if(req.params.jenisTransaksi == 'PH'){
    title = 'Jurnal Pembayaran Hutang Deposit';
  }else if(req.params.jenisTransaksi == 'PB'){
    title = 'Jurnal Pembelian';
  }else if(req.params.jenisTransaksi == 'PPH'){
    title = 'Jurnal Pembayaran Pembelian Hutang';
  }else if(req.params.jenisTransaksi == 'PJ'){
    title = 'Jurnal Penjualan';
  }
  console.log("data response "+JSON.stringify(dataResponse));
  let data = {
    title : title,
    count : count,
    tgl: '',
    faktur: '',
    namaPerusahaan: config.perusahaan.nama,
    periode: periode+' '+dt.getFullYear(),
    sessionUsers : req.session.users,
    mengetahui: config.perusahaan.mengetahui,
    rows : dataResponse
  }
  res.render('transaksi/cetakPrint.html', data);
};

exports.printRincianJurnal = async function (req, res, next) {
  // body...
  let dataResponse = [];
  let status = 'success';
  let count  = 0;
  await new Promise(function(resolve, reject) {
    modelJurnal.rincianJurnal(req, function(err, data){
      if(err){
        common.log("err data print "+data);
        status = 'failed';
        resolve();
      }else{
        dataResponse = data;
        resolve();
      }
    });
  });

  let dt = new Date();
  if(req.params.jenisTransaksi == 'DP'){
    dt = dataResponse[0].deposit_ts;
  }
  let month = new Array();
  month[0] = "Januari";
  month[1] = "Februari";
  month[2] = "Maret";
  month[3] = "April";
  month[4] = "Mei";
  month[5] = "Juni";
  month[6] = "Juli";
  month[7] = "Agustus";
  month[8] = "September";
  month[9] = "Oktober";
  month[10] = "November";
  month[11] = "Desember";
  let periode = month[dt.getMonth()];
  let title = 'Jurnal Kas Masuk';
  if(req.params.jenisTransaksi == 'KK'){
    title = 'Jurnal Kas Keluar';
  }else if(req.params.jenisTransaksi == 'JR'){
    title = 'Jurnal Khusus';
  }else if(req.params.jenisTransaksi == 'DP'){
    title = 'Rincian Deposit';
  }else if(req.params.jenisTransaksi == 'PH'){
    title = 'Rincian Pembayaran Hutang Deposit';
  }else if(req.params.jenisTransaksi == 'PB'){
    title = 'Rincian Pembelian';
  }else if(req.params.jenisTransaksi == 'PPH'){
    title = 'Rincian Pembayaran Pembelian Hutang';
  }else if(req.params.jenisTransaksi == 'PJ'){
    title = 'Rincian Penjualan';
  }
  console.log("data response "+JSON.stringify(dataResponse));
  let data = {
    title : title,
    count : count,
    tgl: '',
    faktur: '',
    namaPerusahaan: config.perusahaan.nama,
    periode: periode+' '+dt.getFullYear(),
    sessionUsers : req.session.users,
    mengetahui: config.perusahaan.mengetahui,
    rows : dataResponse
  }
  if(req.params.jenisTransaksi == 'DP'){
    res.render('transaksi/cetakRincian/printDeposit.html', data);
  }else if(req.params.jenisTransaksi == 'PH'){
    res.render('transaksi/cetakRincian/printBayarHutangDeposit.html', data);
  }else if(req.params.jenisTransaksi == 'PB'){
    res.render('transaksi/cetakRincian/printPembelian.html', data);
  }else if(req.params.jenisTransaksi == 'PPH'){
    res.render('transaksi/cetakRincian/printBayarHutangPembelian.html', data);
  }
};
