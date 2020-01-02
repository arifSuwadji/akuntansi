'use strict';

const connection = require('../../db');
const common = require('../../common');

exports.list = function (req, callback) {
  // body...
  return new Promise(function(resolve, reject) {
    let start = parseInt(req.query.start);
    let length = parseInt(req.query.length);
    let value = req.query.search.value;
    value += "%";
    let column = parseInt(req.query.order[0].column);
    let sort = req.query.order[0].dir;

    let sql = "SELECT * FROM suplier WHERE nama_suplier LIKE ? ORDER BY sup_id ASC LIMIT ?,?";
    if(sort == 'desc')
      sql = "SELECT * FROM suplier WHERE nama_suplier LIKE ? ORDER BY sup_id DESC LIMIT ?,?";
    if(column == 1){
      sql = "SELECT * FROM suplier WHERE nama_suplier LIKE ? ORDER BY nama_suplier ASC LIMIT ?,?";
      if(sort == 'desc')
        sql = "SELECT * FROM suplier WHERE nama_suplier LIKE ? ORDER BY nama_suplier DESC LIMIT ?,?";
    }else if(column == 2){
      sql = "SELECT * FROM suplier WHERE nama_suplier LIKE ? ORDER BY saldo_suplier ASC LIMIT ?,?";
      if(sort == 'desc')
        sql = "SELECT * FROM suplier WHERE nama_suplier LIKE ? ORDER BY saldo_suplier DESC LIMIT ?,?";
    }
    connection.query(sql, [value, start, length], function(err, rows, fields){
      if(err){
        common.log("err query "+err.message);
        throw err;
      }else{
        if(!rows[0]){
          callback('failed', 'no data');
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

exports.count = function (req, callback) {
  // body...
  return new Promise(function(resolve, reject) {
    let value = req.query.search.value;
    value += "%";
    let sql = "SELECT COUNT(*) AS countSuplier FROM suplier WHERE nama_suplier like ?";
    connection.query(sql, [value, value], function(err, rows, fields){
      if(err){
        common.log("error "+err.message);
        throw err;
      }else{
        if(!rows[0]){
          callback('failed', 0);
          return;
        }else{
          callback('', rows[0].countSuplier);
          resolve();
          return;
        }
      }
    });
  });
};

exports.akunPerkiraan = function (kode_akun, callback) {
  // body...
  return new Promise(function(resolve, reject) {
    let kode_search = kode_akun+'%';
    let sql = "SELECT * FROM akun_perkiraan WHERE kode_akun LIKE ? AND tipe_akun=?";
    connection.query(sql, [kode_search, 'detail'], function(err, rows, fields){
      if(err){
        common.log("error "+err.message);
        throw err;
      }else{
        if(!rows[0]){
          callback('failed', 'no data');
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

exports.akunById = function (akunID, callback) {
  // body...
  return new Promise(function(resolve, reject) {
    let sql = "SELECT * FROM akun_perkiraan WHERE akun_id = ?";
    connection.query(sql, [akunID], function(err, rows, fields){
      if(err){
        common.log("error "+err.message);
        throw err;
      }else{
        if(!rows[0]){
          callback('failed', 'no data');
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

exports.updateAkunPersediaan = function (supID, akunPersediaan, callback) {
  // body...
  return new Promise(function(resolve, reject) {
    let sql = "UPDATE suplier SET akun_persediaan=? WHERE sup_id=?";
    connection.query(sql, [akunPersediaan, supID], function(err, rows, fields){
      if(err){
        common.log("error "+err.message);
        throw err;
      }else{
        callback('','has update persediaan');
        resolve();
      }
    });
  });
};

exports.updateAkunHutang = function (supID, akunHutang, callback) {
  // body...
  return new Promise(function(resolve, reject) {
    let sql = "UPDATE suplier SET akun_hutang=? WHERE sup_id=?";
    connection.query(sql, [akunHutang, supID], function(err, rows, fields){
      if(err){
        common.log("error "+err.message);
        throw err;
      }else{
        callback('','has update hutang');
        resolve();
      }
    });
  });
};

exports.countSaldoSuplierBySuplier = function (req, callback) {
  // body...
  return new Promise(function(resolve, reject) {
    let value = req.query.search.value;
    let tanggal=''; let tanggal2='';
    if(value){
      let arrVal = value.split(/\_/);
      tanggal = arrVal[0].split('/').reverse().join('-');
      tanggal2 = arrVal[1].split('/').reverse().join('-');
    }
    let suplierID = req.params.idSuplier;
    let sql = "SELECT COUNT(*) AS countSaldoSuplier FROM saldo_suplier LEFT JOIN mutasi_suplier ON mutasi_suplier.saldo_suplier = saldo_suplier.saldo_id AND saldo_suplier > 0 WHERE suplier=? AND saldo_ts >= ? AND saldo_ts < ? + INTERVAL 1 DAY";
    connection.query(sql, [suplierID, tanggal, tanggal2], function(err, rows, fields){
      if(err){
        common.log("error "+err.message);
        throw err;
      }else{
        if(!rows[0]){
          callback('failed', 0);
          return;
        }else{
          callback('', rows[0].countSaldoSuplier);
          resolve();
          return;
        }
      }
    });
  });
};

exports.countPembelianBySuplier = function (req, callback) {
  return new Promise(function(resolve, reject) {
    // body...
    let value = req.query.search.value;
    let tanggal=''; let tanggal2='';
    if(value){
      let arrVal = value.split(/\_/);
      tanggal = arrVal[0].split('/').reverse().join('-');
      tanggal2 = arrVal[1].split('/').reverse().join('-');
    }
    let suplierID = req.params.idSuplier;
    let sql = "SELECT COUNT(*) AS countPembelian FROM pembelian LEFT JOIN mutasi_suplier ON mutasi_suplier.pembelian = pembelian.pembelian_id AND pembelian > 0 WHERE suplier=? AND pembelian_ts >= ? AND pembelian_ts < ? + INTERVAL 1 DAY";
    connection.query(sql, [suplierID, tanggal, tanggal2], function(err, rows, fields){
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

exports.listMutasiSaldoSuplier = function (req, callback) {
  // body...
  return new Promise(function(resolve, reject) {
    let value = req.query.search.value;
    let tanggal=''; let tanggal2='';
    if(value){
      let arrVal = value.split(/\_/);
      tanggal = arrVal[0].split('/').reverse().join('-');
      tanggal2 = arrVal[1].split('/').reverse().join('-');
    }
    let suplierID = req.params.idSuplier;
    let sql = "SELECT *, CONCAT(saldo_ts, '') AS tsView FROM saldo_suplier LEFT JOIN mutasi_suplier ON mutasi_suplier.saldo_suplier = saldo_suplier.saldo_id AND saldo_suplier > 0 WHERE suplier=? AND saldo_ts >= ? AND saldo_ts < ? + INTERVAL 1 DAY";
    connection.query(sql, [suplierID, tanggal, tanggal2], function(err, rows, fields){
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
    let suplierID = req.params.idSuplier;
    let sql = "SELECT *,CONCAT(pembelian_ts,'') AS tsView FROM pembelian LEFT JOIN mutasi_suplier ON mutasi_suplier.pembelian = pembelian.pembelian_id AND pembelian > 0 WHERE suplier=? AND pembelian_ts >= ? AND pembelian_ts < ? + INTERVAL 1 DAY";
    connection.query(sql, [suplierID, tanggal, tanggal2], function(err, rows, fields){
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

exports.countPembelianHutangBySuplier = function (req, callback) {
  // body...
  return new Promise(function(resolve, reject) {
    let value = req.query.search.value;
    let tanggal=''; let tanggal2='';
    if(value){
      let arrVal = value.split(/\_/);
      tanggal = arrVal[0].split('/').reverse().join('-');
      tanggal2 = arrVal[1].split('/').reverse().join('-');
    }
    let suplierID = req.params.idSuplier;
    let sql = "SELECT COUNT(*) AS countPembelianHutang FROM pembelian LEFT JOIN mutasi_hutang_suplier ON mutasi_hutang_suplier.pembelian = pembelian.pembelian_id AND pembelian > 0 WHERE suplier=? AND bayar IS NULL AND pembelian_ts >= ? AND pembelian_ts < ? + INTERVAL 1 DAY";
    connection.query(sql, [suplierID, tanggal, tanggal2], function(err, rows, fields){
      if(err){
        common.log("error "+err.message);
        throw err;
      }else{
        if(!rows[0]){
          callback('failed', 0);
          return;
        }else{
          callback('', rows[0].countPembelianHutang);
          resolve();
          return;
        }
      }
    });
  });
};

exports.countBayarPembelianHutangBySuplier = function (req, callback) {
  return new Promise(function(resolve, reject) {
    // body...
    let value = req.query.search.value;
    let tanggal=''; let tanggal2='';
    if(value){
      let arrVal = value.split(/\_/);
      tanggal = arrVal[0].split('/').reverse().join('-');
      tanggal2 = arrVal[1].split('/').reverse().join('-');
    }
    let suplierID = req.params.idSuplier;
    let sql = "SELECT COUNT(*) AS countBayarPembelian FROM bayar_hutang_suplier LEFT JOIN mutasi_hutang_suplier ON mutasi_hutang_suplier.bayar = bayar_hutang_suplier.bayar_id AND bayar > 0 WHERE suplier=? AND bayar_hutang_ts >= ? AND bayar_hutang_ts < ? + INTERVAL 1 DAY";
    connection.query(sql, [suplierID, tanggal, tanggal2], function(err, rows, fields){
      if(err){
        common.log("error "+err.message);
        throw err;
      }else{
        if(!rows[0]){
          callback('failed', 0);
          return;
        }else{
          callback('', rows[0].countBayarPembelian);
          resolve();
          return;
        }
      }
    });
  });
};

exports.listPembelianHutangSuplier = function (req, callback) {
  // body...
  return new Promise(function(resolve, reject) {
    let value = req.query.search.value;
    let tanggal=''; let tanggal2='';
    if(value){
      let arrVal = value.split(/\_/);
      tanggal = arrVal[0].split('/').reverse().join('-');
      tanggal2 = arrVal[1].split('/').reverse().join('-');
    }
    let suplierID = req.params.idSuplier;
    let sql = "SELECT *,CONCAT(pembelian_ts,'') AS tsView FROM pembelian LEFT JOIN mutasi_hutang_suplier ON mutasi_hutang_suplier.pembelian = pembelian.pembelian_id AND pembelian > 0 WHERE suplier=? AND bayar IS NULL AND pembelian_ts >= ? AND pembelian_ts < ? + INTERVAL 1 DAY";
    connection.query(sql, [suplierID, tanggal, tanggal2], function(err, rows, fields){
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

exports.listBayarPembelianHutangSuplier = function (req, callback) {
  return new Promise(function(resolve, reject) {
    // body...
    let value = req.query.search.value;
    let tanggal=''; let tanggal2='';
    if(value){
      let arrVal = value.split(/\_/);
      tanggal = arrVal[0].split('/').reverse().join('-');
      tanggal2 = arrVal[1].split('/').reverse().join('-');
    }
    let suplierID = req.params.idSuplier;
    let sql = "SELECT *,CONCAT(bayar_hutang_ts,'') AS tsView FROM bayar_hutang_suplier LEFT JOIN mutasi_hutang_suplier ON mutasi_hutang_suplier.bayar = bayar_hutang_suplier.bayar_id AND bayar > 0 WHERE suplier=? AND bayar_hutang_ts >= ? AND bayar_hutang_ts < ? + INTERVAL 1 DAY";
    connection.query(sql, [suplierID, tanggal, tanggal2], function(err, rows, fields){
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
