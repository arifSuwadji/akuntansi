"use strict";

const connection = require("../../db");
const common = require("../../common");

exports.dataMember = function (callback) {
  // body...
  return new Promise(function(resolve, reject) {
    let sql = "SELECT * FROM member";
    connection.query(sql, function(err, rows, fields){
      if(err){
        common.log("query member "+err.message);
        throw err;
      }else{
        callback('', rows);
        resolve();
      }
    });
  });
};

exports.saldoMember = function (memberID, callback) {
  // body...
  return new Promise(function(resolve, reject) {
    let sql = "SELECT * FROM member WHERE member_id=?";
    connection.query(sql, [memberID], function(err, rows, fields){
      if(err){
        common.log("query saldo "+err.message);
        throw err;
      }else{
        if(!rows[0]){
          callback('failed', 0);
          resolve();
        }else{
          callback('', rows[0].saldo_hutang);
          resolve();
        }
      }
    })
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

exports.dataMemberById = function (memberID, callback) {
  // body...
  return new Promise(function(resolve, reject) {
    try{
      let sql = "SELECT * FROM member where member_id=?";
      connection.query(sql, [memberID], function(err, rows, fields){
        if(err){
          common.log("query member id "+err.message);
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
      common.log("data member by id "+err.message);
      callback('failed', err.message);
      resolve();
    }
  });
};

exports.mutasiHutang = function (memberID, bayarID, nominal, jumlah, callback) {
  // body...
  return new Promise(function(resolve, reject) {
    try{
      let sql = "INSERT INTO mutasi_hutang_member (member, bayar, nominal, jumlah) VALUE(?, ?, ?, ?)";
      connection.query(sql, [memberID, bayarID, nominal, jumlah], function(err, rows, fields){
        if(err){
          common.log("insert mutasi hutang "+err.message);
          callback('failed', err.message);
          resolve();
          return;
        }else{
          callback('', 'insert success');
          resolve();
        }
      })
    }catch(err){
      common.log("data member by komodo id "+err.message);
      callback('failed', err.message);
      resolve();
    }
  });
};

exports.updateSaldoHutang = function (memberID, jumlah, callback) {
  // body...
  return new Promise(function(resolve, reject) {
    try{
      let sql = "UPDATE member SET saldo_hutang=? WHERE member_id=?";
      connection.query(sql, [jumlah, memberID], function(err, rows, fields){
        if(err){
          common.log("update saldo hutang member "+err.message);
          callback('failed', err.message);
          resolve();
          return;
        }else{
          callback('', 'update success');
          resolve();
        }
      });
    }catch(err){
      common.log("update saldo hutang "+err.message);
      callback('failed', err.message);
      resolve();
    }
  });
};

exports.insertBayar = function (data, adminID, jurnalId, callback) {
  // body...
  return new Promise(function(resolve, reject) {
    let sql = "INSERT INTO bayar_hutang_member (member, debit_akun_id, kredit_akun_id, keterangan_bayar, admin, jurnal, bayar_ts) VALUE(?, ?, ?, ?, ?, ?, ?)";
    connection.query(sql, [data.member, data.akun_debit, data.akun_kredit, data.keterangan, adminID, jurnalId, common.now()], function(err, rows, fields){
      if(err){
        common.log("insert bayar hutang "+err.message);
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
