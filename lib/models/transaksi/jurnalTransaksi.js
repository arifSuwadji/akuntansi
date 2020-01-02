"use strict";

const common = require("../../common");
const connection = require("../../db");

exports.insert = function (tanggal, keterangan, catatan, faktur, adminID, callback) {
  // body...
  return new Promise(function(resolve, reject) {
    try{
      let keteranganAkhir = keterangan;
      if(catatan)
        keteranganAkhir = keterangan+' ('+catatan+')';
      let sql = "INSERT INTO jurnal (tanggal, faktur, keterangan, admin, jurnal_ts) value(?, ?, ?, ?, ?)";
      connection.query(sql, [tanggal, faktur, keteranganAkhir, adminID, common.now()], function(err, rows, fields){
        if(err){
          common.log("insert jurnal "+err.message);
          callback('failed', err.message);
          return;
        }else{
          callback('', rows.insertId);
          resolve();
          return;
        }
      })
    }catch(err){
      common.log("insert jurnal "+err.message);
      callback('failed', err.message);
      resolve();
    }
  });
};

exports.insertDetail = function (jurnalID, akunPerkiraan, debit, kredit, callback) {
  // body...
  return new Promise(function(resolve, reject) {
    try{
      let sql = "INSERT INTO jurnal_detail VALUE(?, ?, ?, ?)";
      connection.query(sql, [jurnalID, akunPerkiraan, debit, kredit], function(err, rows, fields){
        if(err){
          common.log("insert detail "+err.message);
          callback('failed', err.message);
          return;
        }else{
          callback('', 'insert success');
          resolve();
          return;
        }
      })
    }catch(err){
      common.log("inser detail jurnal "+err.message);
      callback('failed', err.message);
      resolve();
    }
  });
};

exports.deleteDetail = function (jurnalID, callback) {
  // body...
  return new Promise(function(resolve, reject) {
    let sql = "DELETE FROM jurnal_detail WHERE jurnal=?";
    connection.query(sql, [jurnalID], function(err, rows, fields){
      if(err){
        common.log("delete detail "+err.message);
        callback('failed', err.message);
        return;
      }else{
        callback('', 'delete success');
        resolve();
        return;
      }
    })
  });
};

exports.countDetailByJurnal = function (jurnalID, callback) {
  // body...
  return new Promise(function(resolve, reject) {
    let sql = "SELECT COUNT(*) AS countJurnalDetail FROM jurnal_detail INNER JOIN jurnal ON jurnal.jurnal_id = jurnal_detail.jurnal INNER JOIN akun_perkiraan ON akun_perkiraan.akun_id = jurnal_detail.akun_perkiraan WHERE jurnal=?";
    connection.query(sql, [jurnalID], function(err, rows, fields){
      if(err){
        common.log("select jurnal detail "+err.message);
        callback('failed', err.message);
      }else{
        callback('',  rows[0].countJurnalDetail);
        resolve();
      }
    });
  });
};

exports.detailByJurnal = function (jurnalID, callback) {
  // body...
  return new Promise(function(resolve, reject) {
    let sql = "SELECT *, DATE_FORMAT(tanggal, '%d-%m-%Y') AS tglView FROM jurnal_detail INNER JOIN jurnal ON jurnal.jurnal_id = jurnal_detail.jurnal INNER JOIN akun_perkiraan ON akun_perkiraan.akun_id = jurnal_detail.akun_perkiraan WHERE jurnal=?";
    connection.query(sql, [jurnalID], function(err, rows, fields){
      if(err){
        common.log("select jurnal detail "+err.message);
        callback('failed', err.message);
      }else{
        callback('',  rows);
        resolve();
      }
    });
  });
};

exports.rincianJurnal = function (req, callback) {
  // body...
  return new Promise(function(resolve, reject) {
    let sql = ""
    if(req.params.jenisTransaksi == 'DP'){
      sql = "SELECT *, DATE_FORMAT(deposit_ts, '%d-%m-%Y %H:%i:%s') AS tglView FROM deposit INNER JOIN jurnal ON jurnal.jurnal_id = deposit.jurnal INNER JOIN member ON member.komodo_id = deposit.member_komodo_id INNER JOIN deposit_tipe ON deposit_tipe.deposit_tipe_id = deposit.deposit_tipe WHERE jurnal =?";
    }else if(req.params.jenisTransaksi == 'PH'){
      sql = "SELECT *, DATE_FORMAT(bayar_ts, '%d-%m-%Y %H:%i:%s') AS tglView,member.nama_lengkap AS nama_lengkap_member, mutasi_hutang_member.nominal AS nominal_bayar FROM bayar_hutang_member INNER JOIN jurnal ON jurnal.jurnal_id = bayar_hutang_member.jurnal LEFT JOIN mutasi_hutang_member ON mutasi_hutang_member.bayar = bayar_hutang_member.bayar_id AND mutasi_hutang_member.bayar > 0 INNER JOIN member ON member.member_id = bayar_hutang_member.member INNER JOIN admin ON admin.admin_id = bayar_hutang_member.admin WHERE jurnal=?";
    }else if(req.params.jenisTransaksi == 'PB'){
      sql = "SELECT *, DATE_FORMAT(pembelian_ts, '%d-%m-%Y %H:%i:%s') AS tglView FROM pembelian INNER JOIN jurnal ON jurnal. jurnal_id = pembelian.jurnal INNER JOIN admin ON admin.admin_id = pembelian.admin LEFT JOIN mutasi_suplier ON mutasi_suplier.pembelian = pembelian.pembelian_id AND mutasi_suplier.pembelian > 0 INNER JOIN suplier ON suplier.sup_id = mutasi_suplier.suplier WHERE jurnal=?";
    }else if(req.params.jenisTransaksi == 'PPH'){
      sql = "SELECT *, bayar_hutang_suplier.nominal AS nominal_bayar, DATE_FORMAT(bayar_hutang_ts, '%d-%m-%Y %H:%i:%s') AS tglView, DATE_FORMAT(pembelian_ts, '%d-%m-%Y %H:%i:%s') AS tglPembelian, pembelian.nominal AS nominal_pembelian FROM bayar_hutang_suplier INNER JOIN jurnal ON jurnal.jurnal_id = bayar_hutang_suplier.jurnal LEFT JOIN mutasi_hutang_suplier ON mutasi_hutang_suplier.bayar = bayar_hutang_suplier.bayar_id AND mutasi_hutang_suplier.bayar > 0 INNER JOIN suplier ON suplier.sup_id = mutasi_hutang_suplier.suplier INNER JOIN pembelian ON pembelian.pembelian_id = mutasi_hutang_suplier.pembelian INNER JOIN admin ON admin.admin_id = bayar_hutang_suplier.admin WHERE bayar_hutang_suplier.jurnal=?"
    }
    connection.query(sql, [req.params.idJurnal], function(err, rows, fields){
      if(err){
        common.log("select jurnal detail "+err.message);
        callback('failed', err.message);
      }else{
        callback('',  rows);
        resolve();
      }
    });
  });
};
