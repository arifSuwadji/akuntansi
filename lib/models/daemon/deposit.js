"use strict";

const connectionKomdo = require("../../dbkomodo");
const connection = require("../../db");
const common = require("../../common");

exports.dataDeposit = function (callback) {
  // body...
  try{
    return new Promise(function(resolve, reject) {
      let sql = "SELECT * FROM deposit ORDER BY komodo_mutasi_id DESC LIMIT 1";
      connection.query(sql, function(err, rows, fields){
        if(err){
          common.log("eror query "+err.message);
          throw err;
        }else{
          if(!rows[0]){
            callback('failed', 'no data deposit');
            return;
          }else{
            callback('', rows);
            resolve();
            return;
          }
        }
      })
    });
  }catch(err){
    common.log("error data deposit "+err.message);
    throw err;
  }
};

exports.dataMutasiDepositKomodo = function (mutasiID, callback) {
  // body...
  try{
    return new Promise(function(resolve, reject) {
      let sql = "SELECT * FROM mutations WHERE id > ? AND code=?";
      connectionKomdo.query(sql, [mutasiID, "05"], function(err, rows, fields){
        if(err){
          common.log("err data mutasi deposit komodo "+err.message);
          throw err;
        }else{
          if(!rows[0]){
            callback('failed','no data mutasi komodo');
            return;
          }else{
            callback('', rows);
            resolve();
            return;
          }
        }
      });
    });
  }catch(err){
    common.log("error data mutasi deposit komodo "+err.message);
    throw err;
  }
};

exports.insertNewMutasi = function (data, callback) {
  // body...
  return new Promise(function(resolve, reject) {
    try{
      let sql = "INSERT INTO deposit(komodo_mutasi_id, tanggal, member_komodo_id, nominal, keterangan, catatan, deposit_ts) VALUE(?, ?, ?, ?, ?, ?, ?)";
      connection.query(sql, [data.id, data.created_date, data.store_id, data.amount, data.description, data.note, data.created], function(err, rows, fields){
        if(err){
          common.log("insert mutasi deposit "+err.message);
          throw err;
        }else{
          callback('', 'insert berhasil');
          resolve();
        }
      })
    }catch(err){
      common.log("error "+err.message);
      throw err;
    }
  });
};
