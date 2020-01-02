"use strict";

const connection = require("../../db");
const common = require("../../common");

exports.list = function (req, callback) {
  // body...
  return new Promise(function(resolve, reject) {
    let start = parseInt(req.query.start);
    let length = parseInt(req.query.length);
    let value = req.query.search.value;
    value += "%";
    let column = parseInt(req.query.order[0].column);
    let sort = req.query.order[0].dir;
    let firstsql = "SELECT * FROM member as m inner join member ON member.saldo_hutang = m.saldo_hutang AND m.saldo_hutang > 0 AND m.member_id = member.member_id WHERE m.nama like ? OR m.nama_lengkap like ?";
    try{
      let sql = "SELECT * FROM member WHERE nama like ? OR nama_lengkap like ? ORDER BY komodo_id ASC LIMIT ?,?";
      if(sort == 'desc')
        sql = "SELECT * FROM member WHERE nama like ? OR nama_lengkap like ? ORDER BY komodo_id DESC LIMIT ?,?";
      if(column == 2){
        sql = "SELECT * FROM member WHERE nama like ? OR nama_lengkap like ? ORDER BY nama ASC LIMIT ?,?";
        if(sort == 'desc')
          sql = "SELECT * FROM member WHERE nama like ? OR nama_lengkap like ? ORDER BY nama DESC LIMIT ?,?";
      }else if(column == 3){
        sql = "SELECT * FROM member WHERE nama like ? OR nama_lengkap like ? ORDER BY nama_lengkap ASC LIMIT ?,?";
        if(sort == 'desc')
          sql = "SELECT * FROM member WHERE nama like ? OR nama_lengkap like ? ORDER BY nama_lengkap DESC LIMIT ?,?";
      }else if(column == 4){
        sql = "SELECT * FROM member WHERE nama like ? OR nama_lengkap like ? ORDER BY saldo_hutang ASC LIMIT ?,?";
        if(sort == 'desc')
          sql = "SELECT * FROM member WHERE nama like ? OR nama_lengkap like ? ORDER BY saldo_hutang DESC LIMIT ?,?";
      }else if(column == 5){
        sql = "SELECT * FROM member WHERE nama like ? OR nama_lengkap like ? ORDER BY limit_hutang ASC LIMIT ?,?";
        if(sort == 'desc')
          sql = "SELECT * FROM member WHERE nama like ? OR nama_lengkap like ? ORDER BY limit_hutang DESC LIMIT ?,?";
      }
      connection.query(sql, [value, value, start, length], function(err, rows, fields){
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
      })
    }catch(err){
      common.log("error list "+err.message);
      throw err;
    }
  });
};

exports.count = function (req, callback) {
  // body...
  return new Promise(function(resolve, reject) {
    let value = req.query.search.value;
    value += "%";
    let sql = "SELECT COUNT(*) AS countMember FROM member WHERE nama like ? OR nama_lengkap like ?";
    //let sql = "SELECT COUNT(*) AS countMember FROM member as m inner join member ON member.saldo_hutang = m.saldo_hutang AND m.saldo_hutang > 0 AND m.member_id = member.member_id WHERE m.nama like ? OR m.nama_lengkap like ?";
    connection.query(sql, [value, value], function(err, rows, fields){
      if(err){
        common.log("error "+err.message);
        throw err;
      }else{
        if(!rows[0]){
          callback('failed', 0);
          return;
        }else{
          callback('', rows[0].countMember);
          resolve();
          return;
        }
      }
    });
  });
};

exports.countMutasiHutangDepositByMember = function (req, callback) {
  // body...
  return new Promise(function(resolve, reject) {
    let value = req.query.search.value;
    let tanggal=''; let tanggal2='';
    if(value){
      let arrVal = value.split(/\_/);
      tanggal = arrVal[0].split('/').reverse().join('-');
      tanggal2 = arrVal[1].split('/').reverse().join('-');
    }
    let memberID = req.params.memberID;
    let sql = "SELECT COUNT(*) AS countMutasi FROM deposit LEFT JOIN mutasi_hutang_member mutasi_hutang_member ON mutasi_hutang_member.deposit = deposit.deposit_id AND deposit > 0 WHERE member=? AND deposit_ts >= ? AND deposit_ts < ? + INTERVAL 1 DAY";
    connection.query(sql, [memberID, tanggal, tanggal2], function(err, rows, fields){
      if(err){
        common.log("error "+err.message);
        throw err;
      }else{
        if(!rows[0]){
          callback('failed', 0);
          return;
        }else{
          callback('', rows[0].countMutasi);
          resolve();
          return;
        }
      }
    });
  });
};

exports.countMutasiBayarHutangDepositByMember = function (req, callback) {
  // body...
  return new Promise(function(resolve, reject) {
    let value = req.query.search.value;
    let tanggal=''; let tanggal2='';
    if(value){
      let arrVal = value.split(/\_/);
      tanggal = arrVal[0].split('/').reverse().join('-');
      tanggal2 = arrVal[1].split('/').reverse().join('-');
    }
    let memberID = req.params.memberID;
    let sql = "SELECT COUNT(*) AS countMutasi FROM bayar_hutang_member LEFT JOIN mutasi_hutang_member ON mutasi_hutang_member.bayar = bayar_hutang_member.bayar_id AND mutasi_hutang_member.bayar > 0 WHERE mutasi_hutang_member.member=? AND bayar_ts >= ? AND bayar_ts < ? + INTERVAL 1 DAY";
    connection.query(sql, [memberID, tanggal, tanggal2], function(err, rows, fields){
      if(err){
        common.log("error "+err.message);
        throw err;
      }else{
        if(!rows[0]){
          callback('failed', 0);
          return;
        }else{
          callback('', rows[0].countMutasi);
          resolve();
          return;
        }
      }
    });
  });
};

exports.listMutasiHutangDepositByMember = function (req, callback) {
  // body...
  return new Promise(function(resolve, reject) {
    let start = parseInt(req.query.start);
    let length = parseInt(req.query.length);
    let value = req.query.search.value;
    let tanggal=''; let tanggal2='';
    if(value){
      let arrVal = value.split(/\_/);
      tanggal = arrVal[0].split('/').reverse().join('-');
      tanggal2 = arrVal[1].split('/').reverse().join('-');
    }
    let memberID = req.params.memberID;
    common.log("tanggal "+tanggal);
    common.log("member id "+memberID);
    common.log("value "+value);
    common.log("start "+start);
    common.log("value "+value);
    let sql = "SELECT *, CONCAT(deposit_ts,'') AS tsView FROM deposit LEFT JOIN mutasi_hutang_member mutasi_hutang_member ON mutasi_hutang_member.deposit = deposit.deposit_id AND deposit > 0 WHERE member=? AND deposit_ts >= ? AND deposit_ts < ? + INTERVAL 1 DAY LIMIT ?,?";
    connection.query(sql, [memberID, tanggal, tanggal2, start, length], function(err, rows, fields){
      if(err){
        common.log("err query "+err.message);
        throw err;
      }else{
        if(!rows[0]){
          callback('failed', 'no data mutasi hutang');
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

exports.listMutasiBayarHutangDepositByMember = function (req, callback) {
  // body...
  return new Promise(function(resolve, reject) {
    let start = parseInt(req.query.start);
    let length = parseInt(req.query.length);
    let value = req.query.search.value;
    let tanggal=''; let tanggal2='';
    if(value){
      let arrVal = value.split(/\_/);
      tanggal = arrVal[0].split('/').reverse().join('-');
      tanggal2 = arrVal[1].split('/').reverse().join('-');
    }
    let memberID = req.params.memberID;
    let sql = "SELECT *, CONCAT('',bayar_ts) AS tsView FROM bayar_hutang_member LEFT JOIN mutasi_hutang_member ON mutasi_hutang_member.bayar = bayar_hutang_member.bayar_id AND mutasi_hutang_member.bayar > 0 WHERE mutasi_hutang_member.member=? AND bayar_ts >= ? AND bayar_ts < ? + INTERVAL 1 DAY LIMIT ?,?";
    connection.query(sql, [memberID, tanggal, tanggal2, start, length], function(err, rows, fields){
      if(err){
        common.log("err query "+err.message);
        throw err;
      }else{
        if(!rows[0]){
          callback('failed', 'no data bayar');
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
