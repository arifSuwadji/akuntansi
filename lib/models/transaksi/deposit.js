"use strict";

const connection = require("../../db");
const common = require("../../common");

exports.count = function (req, callback) {
  // body...
  return new Promise(function(resolve, reject) {
    try{
      let value = req.query.search.value;
      let tanggal = value.split('/').reverse().join('-');
      let sql = "SELECT COUNT(*) AS countDeposit FROM deposit WHERE tanggal=?";
      connection.query(sql, [tanggal], function(err, rows, fields){
        if(err){
          common.log("count deposit "+err.message);
          throw err;
        }else{
          callback('', rows[0].countDeposit);
          resolve();
        }
      });
    }catch(err){
      common.log("count deposit "+err.message);
      throw err;
    }
  });
};

exports.list = function (req, callback) {
  // body...
  return new Promise(function(resolve, reject) {
    let start = parseInt(req.query.start);
    let length = parseInt(req.query.length);
    let value = req.query.search.value;
    let tanggal=''; let nama=''; let catatan='';
    if(value){
      let arrVal = value.split(/\_/);
      tanggal = arrVal[0].split('/').reverse().join('-');
      nama = "%"+arrVal[1]+"%";
      catatan = "%"+arrVal[2]+"%";
    }
    try{
      let sql = "SELECT *, date_format(tanggal, '%d-%m-%Y') AS tglView FROM deposit INNER JOIN member ON member.komodo_id = deposit.member_komodo_id LEFT JOIN deposit_tipe ON deposit_tipe.deposit_tipe_id = deposit.deposit_tipe WHERE tanggal=? AND nama like ? AND catatan like ? ORDER BY komodo_mutasi_id DESC LIMIT ?,?";
      connection.query(sql, [tanggal, nama, catatan, start, length], function(err, rows, fields){
        if(err){
          common.log("query list "+err.message);
          throw err;
        }else{
          callback('', rows);
          resolve();
          return;
        }
      })
    }catch(err){
      common.log("list deposit "+err.message);
      throw err;
    }
  });
};

exports.countById = function (req, callback) {
  // body...
  return new Promise(function(resolve, reject) {
    try{
      let idDeposit = req.params.idDeposit
      let sql = "SELECT COUNT(*) AS countDeposit FROM deposit WHERE deposit_id=?";
      connection.query(sql, [idDeposit], function(err, rows, fields){
        if(err){
          common.log("count deposit by id "+err.message);
          throw err;
        }else{
          callback('', rows[0].countDeposit);
          resolve();
        }
      });
    }catch(err){
      common.log("count deposit by id "+err.message);
      throw err;
    }
  });
};

exports.listById = function (req, callback) {
  // body...
  return new Promise(function(resolve, reject) {
    let start = parseInt(req.query.start);
    let length = parseInt(req.query.length);
    let idDeposit = req.params.idDeposit
    try{
      let sql = "SELECT *, date_format(tanggal, '%d-%m-%Y') AS tglView FROM deposit INNER JOIN member ON member.komodo_id = deposit.member_komodo_id LEFT JOIN deposit_tipe ON deposit_tipe.deposit_tipe_id = deposit.deposit_tipe WHERE deposit_id= ? ORDER BY komodo_mutasi_id DESC LIMIT ?,?";
      connection.query(sql, [idDeposit, start, length], function(err, rows, fields){
        if(err){
          common.log("query list by id deposit "+err.message);
          throw err;
        }else{
          callback('', rows);
          resolve();
          return;
        }
      })
    }catch(err){
      common.log("list deposit by id "+err.message);
      throw err;
    }
  });
};

exports.update = function (depositID, depositTypeID, jurnalID, callback) {
  // body...
  return new Promise(function(resolve, reject) {
    try{
      let sql = "UPDATE deposit SET deposit_tipe=?, jurnal=? WHERE deposit_id=?";
      connection.query(sql, [depositTypeID, jurnalID, depositID], function(err,data){
        if(err){
          common.log("update err "+err.message);
          callback('failed',err.message);
          resolve();
          return;
        }else{
          callback('', 'success');
          resolve();
          return;
        }
      });
    }catch(err){
      common.log("update deposit "+err.message);
      callback('failed', err.message);
      resolve();
    }
  });
};

exports.data = function (depositID, callback) {
  // body...
  return new Promise(function(resolve, reject) {
    try{
      let sql = "SELECT * FROM deposit WHERE deposit_id=?";
      connection.query(sql, [depositID], function(err, rows, data){
        if(err){
          common.log("query err "+err.message);
          callback('failed', err.message);
          resolve();
          return;
        }else{
          if(!rows[0]){
            callback('failed', 'no data deposit');
            resolve();
          }else{
            callback('', rows);
            resolve();
          }
        }
      });
    }catch(err){
      common.log("data deposit "+err.message);
      callback('failed', err.message);
      resolve();
    }
  });
};

exports.tipe = function (depositTypeID, callback) {
  // body...
  return new Promise(function(resolve, reject) {
    try{
      let sql ="SELECT * FROM deposit_tipe WHERE deposit_tipe_id=?";
      connection.query(sql, [depositTypeID], function(err, rows, data){
        if(err){
          common.log("tipe deposit "+err.message);
          callback('failed', err.message);
          resolve();
          return;
        }else{
          if(!rows[0]){
            callback('failed', err.message);
            resolve();
          }else{
            callback('', rows);
            resolve();
          }
        }
      })
    }catch(err){
      common.log("tipe data deposit "+err.message);
      callback('failed', err.message);
      resolve();
    }
  });
};

exports.dataMemberByKomodoId = function (komodoID, callback) {
  // body...
  return new Promise(function(resolve, reject) {
    try{
      let sql = "SELECT * FROM member where komodo_id=?";
      connection.query(sql, [komodoID], function(err, rows, fields){
        if(err){
          common.log("query member komodo id "+err.message);
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
      common.log("data member by komodo id "+err.message);
      callback('failed', err.message);
      resolve();
    }
  });
};

exports.mutasiHutang = function (memberID, depositID, nominal, jumlah, callback) {
  // body...
  return new Promise(function(resolve, reject) {
    try{
      let sql = "INSERT INTO mutasi_hutang_member (member, deposit, nominal, jumlah) VALUE(?, ?, ?, ?)";
      connection.query(sql, [memberID, depositID, nominal, jumlah], function(err, rows, fields){
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

exports.deleteMutasiHutang = function (memberID, depositID, nominal, jumlah, callback) {
  // body...
  return new Promise(function(resolve, reject) {
    try{
      let sql = "DELETE FROM mutasi_hutang_member WHERE member=? AND deposit=? AND nominal=?";
      connection.query(sql, [memberID, depositID, nominal], function(err, rows, fields){
        if(err){
          common.log("DELETE mutasi hutang "+err.message);
          callback('failed', err.message);
          resolve();
          return;
        }else{
          callback('', 'insert success');
          resolve();
        }
      })
    }catch(err){
      common.log("delete mutasi hutang member "+err.message);
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
