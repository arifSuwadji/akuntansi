'use strict'

const connection = require('../../db');
const common = require('../../common');

exports.count = function (req, callback) {
  // body...
  return new Promise(function(resolve, reject) {
    let value = req.query.search.value;
    let tanggal=''; let jenisTransaksi=''; let keterangan='';
    if(value){
      let arrVal = value.split(/\_/);
      tanggal = arrVal[0].split('/').reverse().join('-');
      jenisTransaksi = arrVal[1]+"%";
      keterangan = "%"+arrVal[2]+"%";
    }
    let sql = "SELECT COUNT(*) AS countKas FROM jurnal WHERE faktur LIKE ? AND tanggal=? AND keterangan LIKE ?";
    connection.query(sql, [jenisTransaksi, tanggal, keterangan], function(err, rows, fields){
      if(err){
        callback('failed', err.message);
        resolve();
      }else{
        callback('', rows[0].countKas);
        resolve();
      }
    });
  });
};

exports.list = function (req, callback) {
  // body...
  return new Promise(function(resolve, reject) {
    let start = parseInt(req.query.start);
    let length = parseInt(req.query.length);
    let value = req.query.search.value;
    let tanggal=''; let jenisTransaksi=''; let keterangan='';
    if(value){
      let arrVal = value.split(/\_/);
      tanggal = arrVal[0].split('/').reverse().join('-');
      jenisTransaksi = "%"+arrVal[1]+"%";
      keterangan = "%"+arrVal[2]+"%";
    }
    let sql = "SELECT *, date_format(tanggal, '%d-%m-%Y') AS tglView FROM jurnal WHERE faktur LIKE ? AND tanggal=? AND keterangan LIKE ?";
    connection.query(sql, [jenisTransaksi, tanggal, keterangan], function(err, rows, fields){
      if(err){
        callback('failed', err.message);
        resolve();
      }else{
        callback('', rows);
        resolve();
      }
    })
  });
};
