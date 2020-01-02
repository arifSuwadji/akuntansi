'use strict'

const connection = require('../../db');
const common = require('../../common');

const modelJurnal = require('./jurnal');

let bukubesarInsert = function(jurnalID, tanggal, callback){
  let sql = "INSERT INTO buku_besar (jurnal) value(?)";
  connection.query(sql, [jurnalID], function(err, rows, fields){
    if(err){
      common.log("INSERT BUKU BESAR "+err);
      connection.rollback(function(){
        throw err;
        return;
      });
    }else{
      modelJurnal.detailJurnal(jurnalID, function(err, data){
        if(err){
          common.log("Get jurnal detail "+err);
          connection.rollback(function(){
            throw err;
            return;
          });
        }
        for(var i=0; i < data.length; i++){
          sql = "INSERT INTO buku_besar_detail value(?, ?, ?, ?, ?)";
          let arrB = [rows.insertId, tanggal, data[i].akun_perkiraan, data[i].debit, data[i].kredit];
          connection.query(sql, arrB, function(err, rows, fields){
            if(err){
              common.log("INSERT BB detail "+err);
              connection.rollback(function(){
                throw err;
                return;
              });
            }
          });
        }
        callback(null,'success');
      });
    }
  });
};

exports.insertBB = bukubesarInsert;

exports.byId = function (jurnalId, callback) {
  // body...
  return new Promise(function(resolve, reject) {
    let sql = "SELECT * FROM buku_besar WHERE jurnal=?";
    connection.query(sql, [jurnalId], function(err, rows, data){
      if(err){
        common.log("delete detail "+err.message);
        callback('failed', err.message);
        return;
      }else{
        callback('', rows[0].bukubesar_id);
        resolve();
        return;
      }
    });
  });
};

exports.deleteDetail = function (bbID, callback) {
  // body...
  return new Promise(function(resolve, reject) {
    let sql = "DELETE FROM buku_besar_detail WHERE bukubesar=?";
    connection.query(sql, [bbID], function(err, data){
      if(err){
        common.log("delete detail "+err.message);
        callback('failed', err.message);
        return;
      }else{
        callback('', 'delete success');
        resolve();
        return;
      }
    });
  });
};

exports.insertDetail = function (jurnalID, bbID, tanggal, callback) {
  // body...
  return new Promise(function(resolve, reject) {
    modelJurnal.detailJurnal(jurnalID, function(err, data){
      if(err){
        common.log("Get jurnal detail "+err);
        connection.rollback(function(){
          throw err;
          return;
        });
      }
      for(var i=0; i < data.length; i++){
        let sql = "INSERT INTO buku_besar_detail value(?, ?, ?, ?, ?)";
        let arrB = [bbID, tanggal, data[i].akun_perkiraan, data[i].debit, data[i].kredit];
        connection.query(sql, arrB, function(err, rows, fields){
          if(err){
            common.log("INSERT BB detail "+err);
            connection.rollback(function(){
              throw err;
              return;
            });
          }
        });
      }
      callback(null,'success');
    });
  });
};
