'use strict'

const connection = require('../../db');
const common = require('../../common');

const config = require('../../config');

let countAktiva = [];
let listAktiva = [];
let dataAktiva = function(req, res, next){
  let kode_akun = '1%';
  let countSql = "SELECT COUNT(*) AS countAktiva FROM akun_perkiraan WHERE kode_akun like ?";
  connection.query(countSql, [kode_akun], function(err, rows, fields){
    if(err){
      common.log("select count akun "+err);
      throw err;
    }else{
      countAktiva.splice(0, countAktiva.length);
      countAktiva.push({count : rows[0].countAktiva});
    }
  });

  let sql = "SELECT * FROM akun_perkiraan WHERE kode_akun like ?";
  connection.query(sql, [kode_akun], function(err, rows, fields){
    if(err){
      common.log("select akun "+err);
      throw err;
    }else{
      listAktiva.splice(0, listAktiva.length);
      for(var i=0; i < rows.length; i++){
        listAktiva.push(rows[i]);
      }
      next();
    }
  });
};

let countPasiva = [];
let listPasiva = [];
let dataPasiva = function(req, res, next){
  let kode_akun2 = '2%';
  let kode_akun3 = '3%';
  let countSql = "SELECT COUNT(*) AS countPasiva FROM akun_perkiraan WHERE kode_akun like ? OR kode_akun like ?";
  connection.query(countSql, [kode_akun2, kode_akun3], function(err, rows, fields){
    if(err){
      common.log("select count akun "+err);
      throw err;
    }else{
      countPasiva.splice(0, countPasiva.length);
      countPasiva.push({count : rows[0].countPasiva});
    }
  });

  let sql = "SELECT * FROM akun_perkiraan WHERE kode_akun like ? OR kode_akun like ?";
  connection.query(sql, [kode_akun2, kode_akun3], function(err, rows, fields){
    if(err){
      common.log("select akun "+err);
      throw err;
    }else{
      listPasiva.splice(0, listPasiva.length);
      for(var i=0; i < rows.length; i++){
        listPasiva.push(rows[i]);
      }
      next();
    }
  });
};

let saldoAwal = function(req, res, next){
  let akun_id = req.params.akun_id;
  let tipe_akun = req.params.tipe_akun;
  let kode_akun = req.params.kode_akun+'%';
  let tanggal = req.query.tanggal.split('/').reverse().join('-');

  let sql = 'SELECT SUM(debit) - SUM(kredit) AS saldoDebit, SUM(kredit) - SUM(debit) as saldoKredit FROM buku_besar_detail WHERE akun_perkiraan=? AND tanggal_bb < ?';
  let arrSql = [akun_id, tanggal];
  if(tipe_akun == 'induk'){
    sql = 'SELECT SUM(debit) - SUM(kredit) AS saldoDebit, SUM(kredit) - SUM(debit) as saldoKredit FROM buku_besar_detail INNER JOIN akun_perkiraan ON akun_perkiraan.akun_id = buku_besar_detail.akun_perkiraan WHERE kode_akun like ? AND tanggal_bb < ?';
    arrSql = [kode_akun, tanggal];
  }

  if(req.params.kode_akun == 4 || req.params.kode_akun == 5){
    let kodeLR = '4%';
    if(req.params.kode_akun == 5) kodeLR = '5%';
    sql = 'SELECT SUM(debit) - SUM(kredit) AS saldoDebit, SUM(kredit) - SUM(debit) as saldoKredit FROM buku_besar_detail INNER JOIN akun_perkiraan ON akun_perkiraan.akun_id = buku_besar_detail.akun_perkiraan WHERE kode_akun like ? AND tanggal_bb < ?';
    arrSql = [kodeLR, tanggal];
  }

  connection.query(sql, arrSql, function(err, rows, fields){
    if(err){
      common.log("saldo akun "+err);
      next();
    }else{
      kode_akun = req.params.kode_akun;
      let saldo = 0;
      if(kode_akun.match('^1') || kode_akun.match('^5')){
        saldo = rows[0].saldoDebit;
      }else if(kode_akun.match('^2') || kode_akun.match('^3') || kode_akun.match('^4')){
        saldo = rows[0].saldoKredit;
      }
      let data = {
        saldo : saldo,
      }
      res.json(data);
      return;
    }
  });
}

let saldoMutasi = function(req, res, next){
  let akun_id = req.params.akun_id;
  let tipe_akun = req.params.tipe_akun;
  let kode_akun = req.params.kode_akun+'%';
  let tanggal = req.query.tanggal.split('/').reverse().join('-');
  let tanggal2 = req.query.tanggal2.split('/').reverse().join('-');

  let sql = 'SELECT SUM(debit) - SUM(kredit) AS saldoDebit, SUM(kredit) - SUM(debit) as saldoKredit FROM buku_besar_detail WHERE akun_perkiraan=? and tanggal_bb >= ? and tanggal_bb <= ?';
  let arrSql = [akun_id, tanggal, tanggal2];
  if(tipe_akun == 'induk'){
    sql = 'SELECT SUM(debit) - SUM(kredit) AS saldoDebit, SUM(kredit) - SUM(debit) as saldoKredit FROM buku_besar_detail INNER JOIN akun_perkiraan ON akun_perkiraan.akun_id = buku_besar_detail.akun_perkiraan WHERE kode_akun like ? and tanggal_bb >= ? and tanggal_bb <= ?';
    arrSql = [kode_akun, tanggal, tanggal2];
  }
  if(req.params.kode_akun == 4 || req.params.kode_akun == 5){
    let kodeLR = '4%';
    if(req.params.kode_akun == 5) kodeLR = '5%';
    sql = 'SELECT SUM(debit) - SUM(kredit) AS saldoDebit, SUM(kredit) - SUM(debit) as saldoKredit FROM buku_besar_detail INNER JOIN akun_perkiraan ON akun_perkiraan.akun_id = buku_besar_detail.akun_perkiraan WHERE kode_akun like ? AND tanggal_bb >= ? and tanggal_bb <=?';
    arrSql = [kodeLR, tanggal, tanggal2];
  }
  connection.query(sql, arrSql, function(err, rows, fields){
    if(err){
      common.log("saldo mutasi "+err);
      next();
    }else{
      kode_akun = req.params.kode_akun;
      let saldo = 0;
      if(kode_akun.match('^1') || kode_akun.match('^5')){
        saldo = rows[0].saldoDebit;
      }else if(kode_akun.match('^2') || kode_akun.match('^3') || kode_akun.match('^4')){
        saldo = rows[0].saldoKredit;
      }
      let data = {
        saldo : saldo,
      }
      res.json(data);
      return;
    }
  });
}

exports.dataAktiva = dataAktiva;
exports.listAktiva = listAktiva;
exports.countAktiva = countAktiva;
exports.dataPasiva = dataPasiva;
exports.listPasiva = listPasiva;
exports.countPasiva = countPasiva;
exports.saldoAwal = saldoAwal;
exports.saldoMutasi = saldoMutasi;
