"use strict";

const connection = require("../../db");
const common = require("../../common");
const config = require('../../config');

exports.countKasUtama = function (req, callback) {
  // body...
  return new Promise(function(resolve, reject) {
    let akun_id = config.laporan.akun_kas_utama;
    let value = req.query.search.value;
    let tanggal = value.split('/').reverse().join('-');
    let sql = 'SELECT *, COUNT(*) AS countKas FROM jurnal_detail INNER JOIN jurnal on jurnal.jurnal_id = jurnal_detail.jurnal WHERE akun_perkiraan=? AND tanggal=?';
    connection.query(sql, [akun_id, tanggal], function(err, rows, fields){
      if(err){
        common.log("count kas utama "+err.message);
        throw err.message;
      }else{
        callback('', rows[0].countKas);
        resolve();
      }
    });
  });
}

exports.listKasUtama = function (req, callback) {
  // body...
  return new Promise(function(resolve, reject) {
    let akun_id = config.laporan.akun_kas_utama;
    let value = req.query.search.value;
    let tanggal = value.split('/').reverse().join('-');

    let sql = "SELECT *,date_format(tanggal, '%d-%m-%Y') as tglView FROM jurnal_detail INNER JOIN jurnal on jurnal.jurnal_id = jurnal_detail.jurnal INNER JOIN akun_perkiraan on akun_perkiraan.akun_id = jurnal_detail.akun_perkiraan WHERE akun_perkiraan=? AND tanggal = ?";
    connection.query(sql, [akun_id, tanggal], function(err, rows, fields){
      if(err){
        common.log("select kas utama "+err.message);
        throw err;
      }else{
        callback('', rows);
        resolve();
      }
    });
  });
}

exports.listSaldoAwalUtama = function (req, callback) {
  // body...
  return new Promise(function(resolve, reject) {
    let akun_id = config.laporan.akun_kas_utama;
    let value = req.query.search.value;
    let tanggal = value.split('/').reverse().join('-');

    let sql = "select sum(debit) - sum(kredit) as saldoAwal from jurnal_detail INNER JOIN jurnal on jurnal.jurnal_id = jurnal_detail.jurnal WHERE akun_perkiraan=? and tanggal < ?";
    connection.query(sql, [akun_id, tanggal], function(err, rows, fields){
      if(err){
        common.log("count saldo awal utama "+err.message);
        throw err.message;
      }else{
        callback('', rows);
        resolve();
      }
    });
  });
}
