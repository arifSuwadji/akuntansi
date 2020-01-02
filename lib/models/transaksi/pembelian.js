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

exports.insertBeli = function (data, adminID, jurnalId, callback) {
  // body...
  return new Promise(function(resolve, reject) {
    let nominal = data.nominal;
    nominal = nominal.replace(/,/g,"");
    let diskon = data.diskon;
    if(diskon){
      diskon = diskon.replace(/,/g,"");
    }
    let sql = "INSERT INTO pembelian (tipe_pembelian, akun_debit, akun_kredit, akun_diskon, nominal, nominal_diskon, keterangan_pembelian, admin, jurnal, pembelian_ts) VALUE(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    connection.query(sql, [data.tipe_pembelian, data.akun_debit, data.akun_kredit, data.akun_diskon, nominal, diskon, data.keterangan, adminID, jurnalId, common.now()], function(err, rows, fields){
      if(err){
        common.log("insert pembelian "+err.message);
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

exports.mutasiSuplier = function (suplierID, beliID, nominal, jumlah, callback) {
  // body...
  return new Promise(function(resolve, reject) {
    try{
      let sql = "INSERT INTO mutasi_suplier (suplier, pembelian, nominal, jumlah) VALUE(?, ?, ?, ?)";
      connection.query(sql, [suplierID, beliID, nominal, jumlah], function(err, rows, fields){
        if(err){
          common.log("insert mutasi suplier "+err.message);
          callback('failed', err.message);
          resolve();
          return;
        }else{
          callback('', 'insert success');
          resolve();
        }
      })
    }catch(err){
      common.log("insert mutasi suplier 2 "+err.message);
      callback('failed', err.message);
      resolve();
    }
  });
};

exports.mutasiHutangSuplier = function (suplierID, beliID, nominal, jumlah, callback) {
  // body...
  return new Promise(function(resolve, reject) {
    try{
      let sql = "INSERT INTO mutasi_hutang_suplier (suplier, pembelian, nominal, jumlah) VALUE(?, ?, ?, ?)";
      connection.query(sql, [suplierID, beliID, nominal, jumlah], function(err, rows, fields){
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

exports.updateSaldo = function (suplierID, jumlah, jumlah_hutang, callback) {
  // body...
  return new Promise(function(resolve, reject) {
    try{
      let sql = "UPDATE suplier SET saldo=?, saldo_hutang=? WHERE sup_id=?";
      connection.query(sql, [jumlah, jumlah_hutang, suplierID], function(err, rows, fields){
        if(err){
          common.log("update saldo suplier "+err.message);
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
