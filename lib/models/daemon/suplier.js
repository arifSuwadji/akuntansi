"use strict";

const connectionKomodo = require('../../dbkomodo');
const connection = require("../../db");
const common = require("../../common");

exports.byNamaHandler = function (nama, handler,callback) {
  // body...
  return new Promise(function(resolve, reject) {
    let sql = "SELECT * FROM suplier WHERE nama_suplier=? AND handler=?";
    connection.query(sql, [nama, handler], function(err,rows, fields){
      if(err){
        common.log("error "+err.message);
        throw err.message;
      }else{
        if(rows[0]){
          callback('failed', rows[0].sup_id);
          resolve();
        }else{
          callback('', rows);
          resolve();
        }
      }
    });
  });
};

exports.insertNewSuplier = function (nama, handler, callback) {
  // body...
  return new Promise(function(resolve, reject) {
    let sql = "INSERT INTO suplier (nama_suplier, handler) VALUE(?, ?)";
    connection.query(sql, [nama, handler], function(err, rows, fields){
      if(err){
        common.log("error "+err.message);
        throw err.message;
      }else{
        callback('', rows.insertId);
        resolve();
      }
    });
  });
};

exports.mutasiKomodo = function (tanggal, callback) {
  // body...
  return new Promise(function(resolve, reject) {
    let sql = "SELECT * FROM transactions WHERE id IN (SELECT MAX(id) FROM transactions WHERE created_date = ? - INTERVAL 1 DAY AND supplier_ending_balance IS NOT NULL AND supplier_ending_balance <> 0 GROUP BY handler)";
    connectionKomodo.query(sql, [tanggal], function(err, rows, fields){
      if(err){
        common.log("err "+err.message);
        throw err.message;
      }else{
        callback('', rows);
        resolve();
      }
    });
  });
};

exports.insertNewMutasi = function (dataInsert, callback) {
  // body...
  return new Promise(function(resolve, reject) {
    let sql = "INSERT INTO saldo_suplier (komodo_transaksi_id, tanggal, komodo_handler, nominal, saldo_ts) VALUE(?, ?, ?, ?, ?)";
    connection.query(sql, [dataInsert.id, dataInsert.created_date, dataInsert.handler, dataInsert.supplier_ending_balance, dataInsert.created], function(err, rows, fields){
      if(err){
        common.log("insert mutasi suplier dari komodo "+err.message);
        throw err.message;
      }else{
        callback('','');
        resolve();
      }
    });
  });
};

exports.checkDataMutasi = function (komodo_transaksi_id, callback) {
  // body...
  return new Promise(function(resolve, reject) {
    let sql = "SELECT * FROM saldo_suplier WHERE komodo_transaksi_id=?";
    connection.query(sql, [komodo_transaksi_id], function(err, rows, fields){
      if(err){
        common.log("query saldo suplier "+err.message);
        throw err.message;
      }else{
        if(rows[0]){
          callback('failed','data sudah dientri');
          resolve();
        }else{
          callback('','data belum tersedia');
          resolve();
        }
      }
    });
  });
};

exports.saldoSuplier = function (callback) {
  // body...
  return new Promise(function(resolve, reject) {
    let sql = "SELECT *, CONCAT('',tanggal) AS tanggalFilter, DATE_FORMAT(tanggal, '%d-%m-%Y') AS tanggalFaktur FROM saldo_suplier WHERE tanggal=CURDATE() - INTERVAL 1 DAY AND jurnal IS NULL";
    connection.query(sql, function(err, rows, fields){
      if(err){
        common.log("query saldo suplier by jurnal "+err.message);
        throw err.message;
      }else{
        if(!rows[0]){
          callback('failed', 'no saldo suplier');
          resolve();
        }else{
          callback('', rows);
          resolve();
        }
      }
    });
  });
};

exports.byProfits = function (tanggal, callback) {
  // body...
  return new Promise(function(resolve, reject) {
    let sql = "SELECT * FROM profits WHERE created_date=?";
    connectionKomodo.query(sql, [tanggal], function(err, rows, fields){
      if(err){
        common.log("error "+err.message);
        throw err.message;
      }else{
        if(!rows[0]){
          callback('failed', 'no profits');
          resolve();
        }else{
          callback('', rows);
          resolve();
        }
      }
    });
  });
};

exports.byHandler = function (handler,callback) {
  // body...
  return new Promise(function(resolve, reject) {
    let sql = "SELECT * FROM suplier WHERE handler=?";
    connection.query(sql, [handler], function(err,rows, fields){
      if(err){
        common.log("error "+err.message);
        throw err.message;
      }else{
        if(!rows[0]){
          callback('failed', 'data suplier tidak ada');
          resolve();
        }else{
          callback('', rows);
          resolve();
        }
      }
    });
  });
};

exports.dataPembelian = function (suplier, tanggal, callback) {
  // body...
  return new Promise(function(resolve, reject) {
    let sql = "SELECT * FROM pembelian LEFT JOIN mutasi_suplier ON mutasi_suplier.pembelian = pembelian.pembelian_id AND mutasi_suplier.pembelian = pembelian.pembelian_id WHERE pembelian_ts > ? AND pembelian_ts < ? + INTERVAL 1 DAY AND suplier=?";
    connection.query(sql, [tanggal, tanggal, suplier], function(err, rows, fields){
      if(err){
        common.log("query pembelian suplier per hari "+err.message);
        throw err.message;
      }else{
        if(!rows[0]){
          callback('failed', 'no data pembelian');
          resolve();
        }else{
          let totalPembelian = 0;
          for(let i=0; i < rows.length; i++){
            totalPembelian += rows[i].nominal;
          }
          callback('', totalPembelian);
          resolve();
        }
      }
    });
  });
};

exports.insertMutasiSuplier = function (saldoSuplier, suplier, totalPembelian, callback) {
  // body...
  return new Promise(function(resolve, reject) {
    let sup_id = suplier.sup_id;
    let saldo_id = saldoSuplier.saldo_id
    let saldoAwal = suplier.saldo_perhari;
    let saldoAkhir = saldoSuplier.nominal;
    let nominal = (saldoAwal + totalPembelian) - saldoAkhir;
    let sqlCount = "SELECT COUNT(*) AS countMutasiSuplier FROM mutasi_suplier WHERE suplier=?";
    connection.query(sqlCount, [sup_id], function(errCount, rowsCount, fieldsCount){
      if(errCount){
        common.log("count mutasi suplier "+errCount.message);
        throw errCount.message;
      }else{
        if(rowsCount[0].countMutasiSuplier == 0){
          callback('failed', 'tidak ada mutasi suplier id '+sup_id);
          resolve();
        }else{
          let sql = "INSERT INTO mutasi_suplier (suplier, saldo_suplier, nominal, jumlah) VALUE(?, ?, ?, ?)";
          connection.query(sql, [sup_id, saldo_id, nominal, saldoAkhir], function(err, rows, fields){
            if(err){
              common.log("insert mutasi suplier "+err.message);
              throw err.message;
            }else{
              callback('', nominal);
              resolve();
            }
          });
        }
      }
    });

  });
};

exports.updateSaldobyID = function (sup_id, nominal, callback) {
  // body...
  return new Promise(function(resolve, reject) {
    let sql = "UPDATE suplier SET saldo=?, saldo_perhari=? WHERE sup_id=?";
    connection.query(sql, [nominal, nominal, sup_id], function(err, data){
      if(err){
        common.log("update saldo suplier "+err.message);
        throw err.message;
      }else{
        callback('', 'update saldo suplier berhasil');
        resolve();
      }
    });
  });
};

exports.updateJurnalSaldoSuplier = function (jurnalId, saldoId, callback) {
  // body...
  return new Promise(function(resolve, reject) {
    let sql = "UPDATE saldo_suplier SET jurnal=? WHERE saldo_id=?";
    connection.query(sql, [jurnalId, saldoId], function(err, data){
      if(err){
        common.log("update jurnal saldo suplier komodo "+err.message);
        throw err.message;
      }else{
        callback('', 'update jurnal saldo suplier komodo berhasil');
        resolve();
      }
    });
  });
};
