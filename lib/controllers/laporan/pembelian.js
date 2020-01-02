"use strict";

const common = require("../../common");
const modelSuplier = require("../../models/laporan/suplier");

exports.index = function (req, res, next) {
  // body...
  let data = {
    sessionUsers : req.session.users,
    title : 'Pembelian',
    titleKas: 'Data Pembelian',
    filejs : '/komodojs/laporan/suplier/data_pembelian.js',
    dmy1: common.date(),
    dmy2: common.date(),
  }
  res.render('laporan/pembelian/data_pembelian.html', data);
};

exports.dataPembelian = async function (req, res, next) {
  // body...
  let recordsTotal = 0;
  let recordsFiltered = 0;

  //hitung pembelian suplier
  await new Promise(function(resolve, reject) {
    modelSuplier.countPembelian(req, function(err, data){
      if(err){
        common.log(data);
        resolve();
      }else{
        recordsTotal = recordsTotal + data;
        recordsFiltered = recordsTotal + data;
        resolve();
      }
    })
  });

  let listMutasiPembelian = [];
  await new Promise(function(resolve, reject) {
    modelSuplier.listMutasiPembelian(req, function(err, data){
      if(err){
        common.log(data);
        resolve();
      }else{
        listMutasiPembelian = data;
        resolve();
      }
    });
  });

  let draw = parseInt(req.query.draw);
  let response = {
    "draw" :draw,
    "recordsTotal": recordsTotal,
    "recordsFiltered": recordsTotal,
    "data": listMutasiPembelian
  };
  res.json(response);
};

exports.detailJurnal = function (req, res, next) {
  // body...
  let data = {
    sessionUsers : req.session.users,
    idJurnal: req.params.idJurnal,
    title : 'Jurnal Pembelian',
    titleKas: 'Detail Jurnal',
    filejs : '/komodojs/laporan/suplier/detail_jurnal.js',
    dmy1: common.date(),
    dmy2: common.date(),
  }
  res.render('laporan/pembelian/detail_jurnal.html', data);
};

exports.detailJurnalJson = async function (req, res, next) {
  // body...
  let listDetail = [];
  await new Promise(function(resolve, reject) {
    modelSuplier.detailJurnal(req, function(err,data){
      if(err){
        common.log(data);
        resolve();
      }else{
        listDetail = data;
        resolve();
      }
    });
  });

  let draw = parseInt(req.query.draw);
  let response = {
    "draw" :draw,
    "recordsTotal": 10,
    "recordsFiltered": 10,
    "data": listDetail
  };
  res.json(response);
};
