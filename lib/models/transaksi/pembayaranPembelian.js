"use strict";

const connection = require("../../db");
const common = require("../../common");

exports.dataSuplier = function (callback) {
  // body...
  return new Promise(function(resolve, reject) {
    let sql = "SELECT * FROM suplier";
    connection.query(sql, function(err, rows, fields){
      if(err){
        common.log("select suplier "+err.message);
        throw err.message;
      }else{
        if(!rows[0]){
          callback('failed', 'no data suplier');
          resolve();
        }else{
          callback('', rows);
          resolve();
        }
      }
    });
  });
};

exports.akunSelect = function (callback) {
  // body...
  return new Promise(function(resolve, reject) {
    let sql = "SELECT * FROM akun_perkiraan WHERE tipe_akun='detail' order by kode_akun";
    connection.query(sql, function(err, rows, fields){
      if(err){
        common.log("select "+err);
        throw err;
      }else{
        callback('', rows);
        resolve();
      }
    });
  });
};

exports.dataFaktur = function (req, callback) {
  // body...
  return new Promise(function(resolve, reject) {
    let kode = req.params.kode;
    let dmy1 = req.params.dmy1;
    let tanggal = dmy1.split("-").join("");
    let nomor = kode + tanggal;
    let sql = "SELECT * FROM nomor_faktur WHERE nomor=?";
    connection.query(sql, [nomor], function(err, rows, fields){
      if(err){
        common.log("select "+err);
        throw err;
      }else{
        let jumlah = 1;
        let faktur = nomor + pad_with_zeroes(jumlah,7);
        for(var i=0; i < rows.length; i++){
          jumlah = rows[i].jumlah + 1;
          faktur = nomor + pad_with_zeroes(jumlah, 7);
        }
        callback('', faktur);
        resolve();
      }
    });
  });
};

function pad_with_zeroes(number, length) {
    var my_string = '' + number;
    while (my_string.length < length) {
        my_string = '0' + my_string;
    }
    return my_string;
}

exports.dataSuplierByID = function (suplierID, callback) {
  // body...
  return new Promise(function(resolve, reject) {
    try{
      let sql = "SELECT * FROM suplier where sup_id=?";
      connection.query(sql, [suplierID], function(err, rows, fields){
        if(err){
          common.log("query suplier id "+err.message);
          callback('failed',err.message);
          resolve();
          return;
        }else{
          if(!rows[0]){
            callback('failed', 'data tidak ada');
            resolve();
          }else{
            callback('', rows);
            resolve();
          }
        }
      });
    }catch(err){
      common.log("data suplier by id "+err.message);
      callback('failed', err.message);
      resolve();
    }
  });
};

exports.insertBayar = function (data, adminID, jurnalId, callback) {
  // body...
  return new Promise(function(resolve, reject) {
    let nominal = data.nominal;
    nominal = nominal.replace(/,/g,"");

    let sql = "INSERT INTO bayar_hutang_suplier (akun_debit, akun_kredit, nominal, keterangan_bayar, admin, jurnal, bayar_hutang_ts) VALUE(?, ?, ?, ?, ?, ?, ?)";
    connection.query(sql, [data.akun_debit, data.akun_kredit, nominal, data.keterangan, adminID, jurnalId, common.now()], function(err, rows, fields){
      if(err){
        common.log("insert bayar pembelian "+err.message);
        callback('failed', err.message);
        return;
      }else{
        callback('', rows.insertId);
        resolve();
        return;
      }
    });
  });
};

exports.mutasiHutangSuplier = function (suplierID, bayarId, beliID, nominal, jumlah, callback) {
  // body...
  return new Promise(function(resolve, reject) {
    try{
      let sql = "INSERT INTO mutasi_hutang_suplier (suplier, bayar, pembelian, nominal, jumlah) VALUE(?, ?, ?, ?, ?)";
      connection.query(sql, [suplierID, bayarId, beliID, -nominal, jumlah], function(err, rows, fields){
        if(err){
          common.log("insert mutasi hutang suplier "+err.message);
          callback('failed', err.message);
          resolve();
          return;
        }else{
          callback('', 'insert success');
          resolve();
        }
      })
    }catch(err){
      common.log("insert mutasi hutang suplier 2 "+err.message);
      callback('failed', err.message);
      resolve();
    }
  });
};

exports.updateSaldoHutang = function (suplierID, jumlah_hutang, callback) {
  // body...
  return new Promise(function(resolve, reject) {
    try{
      let sql = "UPDATE suplier SET saldo_hutang=? WHERE sup_id=?";
      connection.query(sql, [jumlah_hutang, suplierID], function(err, rows, fields){
        if(err){
          common.log("update saldo hutang suplier "+err.message);
          callback('failed', err.message);
          resolve();
          return;
        }else{
          callback('', 'update success');
          resolve();
        }
      });
    }catch(err){
      common.log("update saldo suplier 2"+err.message);
      callback('failed', err.message);
      resolve();
    }
  });
};

exports.updateSaldoHutangPembelian = function (pembelianID, sisaPembayaran, callback) {
  // body...
  return new Promise(function(resolve, reject) {
    try{
      let sql = "UPDATE pembelian SET sisa_pembayaran=? WHERE pembelian_id=?";
      connection.query(sql, [sisaPembayaran, pembelianID], function(err, rows, fields){
        if(err){
          common.log("update saldo hutang pembelian "+err.message);
          callback('failed', err.message);
          resolve();
          return;
        }else{
          callback('', 'update success');
          resolve();
        }
      });
    }catch(err){
      common.log("update saldo hutang pembelian2 "+err.message);
      callback('failed', err.message);
      resolve();
    }
  });
};

exports.countPembelian = function (req, callback) {
  // body...
  return new Promise(function(resolve, reject) {
    try{
      let value = req.query.search.value;
      let sql = "SELECT COUNT(*) AS countPembelian FROM mutasi_hutang_suplier INNER JOIN pembelian ON pembelian.pembelian_id = mutasi_hutang_suplier.pembelian WHERE suplier=? AND bayar IS NULL AND sisa_pembayaran <> 0";
      connection.query(sql, [value], function(err, rows, fields){
        if(err){
          common.log("count suplier "+err.message);
          throw err;
        }else{
          callback('', rows[0].countPembelian);
          resolve();
        }
      });
    }catch(err){
      common.log("count suplier "+err.message);
      throw err;
    }
  });
};

exports.listPembelian = function (req, callback) {
  // body...
  return new Promise(function(resolve, reject) {
    let start = parseInt(req.query.start);
    let length = parseInt(req.query.length);
    let value = req.query.search.value;
    try{
      let sql = "SELECT *, date_format(pembelian_ts, '%d-%m-%Y %H:%i:%s') AS tanggalView  FROM mutasi_hutang_suplier INNER JOIN pembelian ON pembelian.pembelian_id = mutasi_hutang_suplier.pembelian WHERE suplier=? AND bayar IS NULL AND sisa_pembayaran <> 0 LIMIT ?,?";
      connection.query(sql, [value, start, length], function(err, rows, fields){
        if(err){
          common.log("query list pembelian "+err.message);
          throw err;
        }else{
          callback('', rows);
          resolve();
          return;
        }
      })
    }catch(err){
      common.log("list pembelian "+err.message);
      throw err;
    }
  });
};

exports.listDataPembelianById = function (pembelianID, callback) {
  // body...
  return new Promise(function(resolve, reject) {
    try{
      let sql = "SELECT * FROM pembelian WHERE pembelian_id=?";
      connection.query(sql, [pembelianID], function(err, rows, fields){
        if(err){
          common.log("query list pembelian by id "+err.message);
          throw err;
        }else{
          callback('', rows);
          resolve();
          return;
        }
      })
    }catch(err){
      common.log("list pembelian by id "+err.message);
      throw err;
    }
  });
};
