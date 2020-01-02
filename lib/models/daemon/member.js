"use strict";

const connectionKomodo = require('../../dbkomodo');
const connection = require("../../db");
const common = require("../../common");

exports.dataMember = function (callback) {
  // body...
  return new Promise(function(resolve, reject) {
    try{
      let sql = "SELECT * FROM member ORDER BY member_id DESC LIMIT 1";
      connection.query(sql, function(err, rows, fields){
        if(err){
          common.log("error "+err.message);
          throw err;
        }else{
          if(!rows[0]){
            callback('failed','data member tidak tersedia');
            return;
          }else{
            callback('', rows);
            resolve();
            return;
          }
        }
      })
    }catch(err){
      common.log("error query "+err.message);
      throw err;
    }
  });
};

exports.dataMemberKomodo = function (storeId, callback) {
  // body...
  return new Promise(function(resolve, reject) {
    try{
      let sql = "SELECT * FROM stores WHERE id > ?";
      connectionKomodo.query(sql, [storeId], function(err, rows, fields){
        if(err){
          common.log("select komodo "+err.message);
          throw err;
        }else{
          if(!rows[0]){
            callback('failed', 'data baru store tidak tersedia');
            return;
          }else{
            callback('', rows);
            resolve();
            return;
          }
        }
      });
    }catch(err){
      common.log("error query "+err.message);
      throw err;
    }
  });
};

exports.insertNewMember = function (data, callback) {
  // body...
  return new Promise(function(resolve, reject) {
    try{
      let sql = "INSERT INTO member (komodo_id, nama, nama_lengkap) VALUE (?, ?, ?)";
      connection.query(sql, [data.id, data.name, data.fullname], function(err, rows, fields){
        if(err){
          common.log("insert member "+err.message);
          throw err;
        }else{
          callback('', 'insert berhasil');
          resolve();
        }
      });
    }catch(err){
      common.log("err insert "+err.message);
      throw err;
    }
  });
};
