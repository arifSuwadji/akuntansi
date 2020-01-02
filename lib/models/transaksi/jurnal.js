'use strict'

const connection = require('../../db');
const common = require('../../common');

let listTmp = [];
let countTmp = [];
let dataTmp = function(req, res, next){
  let kode = req.params.kode;
  let tipe_jurnal = 'kas_masuk';
  if(kode == 'KK') tipe_jurnal = 'kas_keluar';
  if(kode == 'JR') tipe_jurnal = 'jurnal_lain';
  let start = parseInt(req.query.start);
  let countSql = 'SELECT *, COUNT(*) AS countTmp FROM jurnal_tmp WHERE admin=?';
  connection.query(countSql, [req.session.users.admin_id], function(err, rows, fields){
    if(err){
      common.log("count tmp "+err);
      throw err;
    }else{
      countTmp.splice(0, countTmp.length);
      countTmp.push({count: rows[0].countTmp});
    }
  });

  let sql = "SELECT * FROM jurnal_tmp INNER JOIN akun_perkiraan on akun_perkiraan.akun_id = jurnal_tmp.akun_perkiraan WHERE admin=? and tipe_jurnal=?";
  connection.query(sql, [req.session.users.admin_id, tipe_jurnal], function(err, rows, fields){
    if(err){
      common.log("select "+err);
      throw err;
    }else{
      listTmp.splice(0, listTmp.length);
      for(var i=0; i < rows.length; i++){
        start++;
        rows[i].hitung = start;
        listTmp.push(rows[i]);
      }
      next();
    }
  });
};

let jurnalTmp = function(kode, admin_id, jurnal_id, callback){
  let tipe_jurnal = 'kas_masuk';
  if(kode == 'KK') tipe_jurnal = 'kas_keluar';
  if(kode == 'JR') tipe_jurnal = 'jurnal_lain';
  let sql = "SELECT * FROM jurnal_tmp WHERE admin=? and tipe_jurnal=?";
  connection.query(sql, [admin_id, tipe_jurnal], function(err, rows, fields){
    if(err){
      common.log("select "+err);
      connection.rollback(function(){
        throw err;
      });
    }else{
      let jumlah_debit = 0;
      let jumlah_kredit = 0;
      for(var i=0; i < rows.length; i++){
        common.log(JSON.stringify(rows[i]));
        sql = "INSERT INTO jurnal_detail (jurnal, akun_perkiraan, debit, kredit) value(?, ?, ?, ?)";
        let arrInsert = [jurnal_id, rows[i].akun_perkiraan, rows[i].debit, rows[i].kredit];
        connection.query(sql, arrInsert, function(err, rowsI, fields){
          if(err){
            common.log("insert jurnal detail "+err);
            connection.rollback(function(){
              throw err;
            });
          }
        });
        jumlah_debit += rows[i].debit;
        jumlah_kredit += rows[i].kredit;
        if(i == rows.length - 1){
          sql = "DELETE FROM jurnal_tmp WHERE admin=? and tipe_jurnal=?";
          connection.query(sql, [admin_id, tipe_jurnal], function(err, rows, fields){
            if(err){
              common.log("delete jurnal tmp "+err);
              connection.rollback(function(){
                throw err;
              });
            }
          });
        }
      }
      let data = {
        debit : jumlah_kredit,
        kredit : jumlah_debit,
      }
      return callback(null, data);
    }
  });
};

let jurnal = function(tanggal, callback){
  let sqlDetail = "SELECT * FROM jurnal WHERE tanggal=?";
  connection.query(sqlDetail, [tanggal], function(err, rows, fields){
    if(err){
      common.log("select posting jurnal "+err);
      throw err;
    }else{
      callback(null,rows);
      return;
    }
  });
}

let jurnalDetail = function(jurnalID, callback){
  let sqlDetail = "SELECT * FROM jurnal_detail WHERE jurnal=?";
  connection.query(sqlDetail, [jurnalID], function(err, rows, fields){
    if(err){
      common.log("select posting jurnal detail "+err);
      throw err;
      callback(err, null);
      return;
    }else{
      callback(null,rows);
      return;
    }
  });
}

exports.tmp = dataTmp;
exports.tmpList = listTmp;
exports.tmpCount = countTmp;
exports.tmpJurnal = jurnalTmp;
exports.detailJurnal = jurnalDetail;
exports.dataJurnal = jurnal;
