'use strict';

const connection = require('../../db');
const common = require('../../common');

exports.countPembelian = function (req, callback) {
  return new Promise(function(resolve, reject) {
    // body...
    let value = req.query.search.value;
    let tanggal=''; let tanggal2='';
    if(value){
      let arrVal = value.split(/\_/);
      tanggal = arrVal[0].split('/').reverse().join('-');
      tanggal2 = arrVal[1].split('/').reverse().join('-');
    }
    let sql = "SELECT COUNT(*) AS countPembelian FROM pembelian LEFT JOIN mutasi_suplier ON mutasi_suplier.pembelian = pembelian.pembelian_id AND pembelian > 0 INNER JOIN suplier ON suplier.sup_id = mutasi_suplier.suplier WHERE pembelian_ts >= ? AND pembelian_ts < ? + INTERVAL 1 DAY";
    connection.query(sql, [tanggal, tanggal2], function(err, rows, fields){
      if(err){
        common.log("error "+err.message);
        throw err;
      }else{
        if(!rows[0]){
          callback('failed', 0);
          return;
        }else{
          callback('', rows[0].countPembelian);
          resolve();
          return;
        }
      }
    });
  });
};

exports.listMutasiPembelian = function (req, callback) {
  // body...
  return new Promise(function(resolve, reject) {
    // body...
    let value = req.query.search.value;
    let tanggal=''; let tanggal2='';
    if(value){
      let arrVal = value.split(/\_/);
      tanggal = arrVal[0].split('/').reverse().join('-');
      tanggal2 = arrVal[1].split('/').reverse().join('-');
    }
    let sql = "SELECT *,CONCAT(pembelian_ts,'') AS tsView FROM pembelian LEFT JOIN mutasi_suplier ON mutasi_suplier.pembelian = pembelian.pembelian_id AND pembelian > 0 INNER JOIN suplier ON suplier.sup_id = mutasi_suplier.suplier WHERE pembelian_ts >= ? AND pembelian_ts < ? + INTERVAL 1 DAY";
    connection.query(sql, [tanggal, tanggal2], function(err, rows, fields){
      if(err){
        common.log("error "+err.message);
        throw err;
      }else{
        if(!rows[0]){
          callback('failed', 0);
          return;
        }else{
          callback('', rows);
          resolve();
          return;
        }
      }
    });
  });
};

exports.detailJurnal = function (req, callback) {
  // body...
  return new Promise(function(resolve, reject) {
    let sql = "SELECT *, date_format(jurnal.tanggal, '%d-%m-%Y') AS tglView FROM jurnal LEFT JOIN jurnal_detail ON jurnal_detail.jurnal = jurnal.jurnal_id INNER JOIN akun_perkiraan ON akun_perkiraan.akun_id = jurnal_detail.akun_perkiraan WHERE jurnal=?";
    connection.query(sql, [req.params.idJurnal], function(err, rows, fields){
      if(err){
        common.log("error "+err.message);
        throw err;
      }else{
        if(!rows[0]){
          callback('failed', 0);
          return;
        }else{
          callback('', rows);
          resolve();
          return;
        }
      }
    });
  });
};
