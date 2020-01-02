"use strict";

const common = require("../../common");
const config = require("../../config.json");

const modelJurnal = require('../../models/laporan/jurnalLaporan');

exports.utama = function (req, res, next) {
  // body...
  let data = {
    sessionUsers : req.session.users,
    title : 'Kas Utama',
    titleKas: config.laporan.kode_kas_utama+' - '+config.laporan.nama_kas_utama,
    filejs : '/komodojs'+req.originalUrl+'.js',
    dmy1: common.date(),
    dmy2: common.date(),
  }
  res.render('laporan/kas/kas_utama.html', data);
};

exports.dataUtama = async function (req, res, next) {
  // body...
  let recordsTotal = 0;
  let recordsFiltered = 0;
  await new Promise(function(resolve, reject) {
    modelJurnal.countKasUtama(req, function(err, data){
      if(err){
        common.log(data);
        resolve();
      }else{
        recordsTotal = data;
        recordsFiltered = data;
        resolve();
      }
    })
  });

  let listKas = [];
  await new Promise(function(resolve, reject) {
    modelJurnal.listKasUtama(req, function(err, data){
      if(err){
        common.log(data);
        resolve();
      }else{
        listKas = data;
        resolve();
      }
    })
  });

  let listSaldoAwal = [];
  await new Promise(function(resolve, reject) {
    modelJurnal.listSaldoAwalUtama(req, function(err,data){
      if(err){
        common.log(data);
        resolve();
      }else{
        listSaldoAwal = data;
        resolve();
      }
    })
  });

  let listKasUtama = [];
  if(!listSaldoAwal[0].saldoAwal){
    listKasUtama.push({hitung:"",tglView:"",faktur:"",keterangan:"Saldo Awal",debit:0,kredit:0,saldo: 0, kode_akun:config.laporan.kode_kas_utama, nama_akun:config.laporan.nama_kas_utama});
    let last_saldo = 0;
    let start = 0;
    for(var i=0; i < listKas.length; i++){
      last_saldo += listKas[i].debit;
      last_saldo -= listKas[i].kredit;
      start++;
      listKas[i].hitung = start;
      listKas[i].saldo = last_saldo;
      listKasUtama.push(listKas[i]);
    }
  }else{
    listKasUtama.push({hitung:"",tglView:"",faktur:"",keterangan:"Saldo Awal ",debit:"",kredit:"",saldo:listSaldoAwal[0].saldoAwal,kode_akun:config.laporan.kode_kas_Utama, nama_akun:config.laporan.nama_kas_Utama});
    let last_saldo = listSaldoAwal[0].saldoAwal;
    let start = 0;
    for(var i=0; i < listKas.length; i++){
      last_saldo += listKas[i].debit;
      last_saldo -= listKas[i].kredit;
      start++;
      listKas[i].hitung = start;
      listKas[i].saldo = last_saldo;
      listKasUtama.push(listKas[i]);
    }
  }

  let draw = parseInt(req.query.draw);
  let response = {
    "draw" :draw,
    "recordsTotal": recordsTotal,
    "recordsFiltered": recordsFiltered,
    "data": listKasUtama
  };
  res.json(response);
};
