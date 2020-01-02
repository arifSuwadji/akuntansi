"use strict";

const connection = require("../../db");
const common = require("../../common");

exports.countById = function (req, callback) {
  // body...
  return new Promise(function(resolve, reject) {
    let idJurnal = req.params.idJurnal;
    let countSql = 'SELECT *, COUNT(*) AS countJurnal FROM jurnal LEFT JOIN jurnal_detail on jurnal_detail.jurnal = jurnal.jurnal_id INNER JOIN akun_perkiraan on akun_perkiraan.akun_id = jurnal_detail.akun_perkiraan WHERE jurnal_id=?';
    connection.query(countSql, [idJurnal], function(err, rows, fields){
      if(err){
        common.log("count jurnal by id "+err.message);
        throw err.message;
      }else{
        callback('', rows[0].countJurnal);
        resolve();
      }
    });
  });
};

exports.listById = function (req, callback) {
  // body...
  return new Promise(function(resolve, reject) {
    let start = parseInt(req.query.start);
    let length = parseInt(req.query.length);
    let idJurnal = req.params.idJurnal;
    let sql = "SELECT *, date_format(tanggal, '%d-%m-%Y') as tglView FROM jurnal LEFT JOIN jurnal_detail on jurnal_detail.jurnal = jurnal.jurnal_id INNER JOIN akun_perkiraan on akun_perkiraan.akun_id = jurnal_detail.akun_perkiraan WHERE jurnal_id=? LIMIT ?,?";
    //let sql = "SELECT *, date_format(tanggal, '%d-%m-%Y') as tglView FROM jurnal";
    connection.query(sql, [idJurnal, start,length], function(err, rows, fields){
      if(err){
        common.log("select jurnal by id "+err.message);
        throw err.message;
      }else{
        callback('', rows);
        resolve();
        return;
      }
    });
  });
};
