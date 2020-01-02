'use strict'

const connection = require('../../db');
const common = require('../../common');

const config = require('../../config');

let countPendapatan = [];
let listPendapatan = [];
let dataPendapatan = function(req, res, next){
  let kode_akun = '4%';
  let countSql = "SELECT COUNT(*) AS countPendapatan FROM akun_perkiraan WHERE kode_akun like ?";
  connection.query(countSql, [kode_akun], function(err, rows, fields){
    if(err){
      common.log("select count akun "+err);
      throw err;
    }else{
      countPendapatan.splice(0, countPendapatan.length);
      countPendapatan.push({count : rows[0].countPendapatan});
    }
  });

  let sql = "SELECT * FROM akun_perkiraan WHERE kode_akun like ?";
  connection.query(sql, [kode_akun], function(err, rows, fields){
    if(err){
      common.log("select akun "+err);
      throw err;
    }else{
      listPendapatan.splice(0, listPendapatan.length);
      for(var i=0; i < rows.length; i++){
        listPendapatan.push(rows[i]);
      }
      next();
    }
  });
};

let countBiaya = [];
let listBiaya = [];
let dataBiaya = function(req, res, next){
  let kode_akun = '5%';
  let countSql = "SELECT COUNT(*) AS countBiaya FROM akun_perkiraan WHERE kode_akun like ?";
  connection.query(countSql, [kode_akun], function(err, rows, fields){
    if(err){
      common.log("select count akun "+err);
      throw err;
    }else{
      countBiaya.splice(0, countBiaya.length);
      countBiaya.push({count : rows[0].countBiaya});
    }
  });

  let sql = "SELECT * FROM akun_perkiraan WHERE kode_akun like ?";
  connection.query(sql, [kode_akun], function(err, rows, fields){
    if(err){
      common.log("select akun "+err);
      throw err;
    }else{
      listBiaya.splice(0, listBiaya.length);
      for(var i=0; i < rows.length; i++){
        listBiaya.push(rows[i]);
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

  let sql = 'SELECT SUM(debit) - SUM(kredit) AS saldoDebit, SUM(kredit) - SUM(debit) as saldoKredit FROM buku_besar_detail WHERE akun_perkiraan=? AND tanggal_bb <= ?';
  let arrSql = [akun_id, tanggal];
  if(tipe_akun == 'induk'){
    sql = 'SELECT SUM(debit) - SUM(kredit) AS saldoDebit, SUM(kredit) - SUM(debit) as saldoKredit FROM buku_besar_detail INNER JOIN akun_perkiraan ON akun_perkiraan.akun_id = buku_besar_detail.akun_perkiraan WHERE kode_akun like ? AND tanggal_bb <= ?';
    arrSql = [kode_akun, tanggal];
  }

  connection.query(sql, arrSql, function(err, rows, fields){
    if(err){
      common.log("saldo akun "+err);
      next();
    }else{
      kode_akun = req.params.kode_akun;
      let saldo = 0;
      if(kode_akun.match('^5')){
        saldo = rows[0].saldoDebit;
      }else if(kode_akun.match('^4')){
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

exports.dataPendapatan = dataPendapatan;
exports.countPendapatan = countPendapatan;
exports.listPendapatan = listPendapatan;
exports.dataBiaya = dataBiaya;
exports.countBiaya = countBiaya;
exports.listBiaya = listBiaya;
exports.saldoAwal = saldoAwal;
