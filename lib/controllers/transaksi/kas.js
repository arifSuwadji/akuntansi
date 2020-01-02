"use strict"

const connection = require('../../db');
const common = require('../../common');
const modelFaktur = require('../../models/transaksi/nomor_faktur');
const modelJurnal = require('../../models/transaksi/jurnal');
const modelBB = require('../../models/transaksi/bukubesar');

let addJurnal = function(req, res, next){
  let kode = req.params.kode;
  let params = req.body;
  common.log("kode "+kode);
  common.log("data post "+JSON.stringify(req.body));
  if(params.op == 'ok'){
    let sql = "INSERT INTO jurnal_tmp (admin, akun_perkiraan, tipe_jurnal, kredit) value(?, ?, ?, ?)";
    let arrInsert = [req.session.users.admin_id, params.akun_perkiraan, 'kas_masuk', params.jumlah];
    if(kode == 'KK'){
      sql = "INSERT INTO jurnal_tmp (admin, akun_perkiraan, tipe_jurnal, debit) value(?, ?, ?, ?)";
      arrInsert = [req.session.users.admin_id, params.akun_perkiraan, 'kas_keluar', params.jumlah];
    }else if(kode == 'JR'){
      sql = "INSERT INTO jurnal_tmp (admin, akun_perkiraan, debit, kredit) value(?, ?, ?, ?)";
      arrInsert = [req.session.users.admin_id, params.akun_perkiraan, params.debit, params.kredit];
    }
    connection.query(sql, arrInsert, function(err, rows, fields){
      if(err){
        common.log("insert "+err);
        next();
      }else{
        res.json({
          status: 'success',
          message: 'insert jurnal tmp berhasil'
        });
        return;
      }
    });
  }else if(params.op == 'submit'){
    connection.beginTransaction(function(err){
      if(err){throw err;}
      modelFaktur.genFaktur(kode, params.tanggal, function(err, faktur){
        common.log("response data "+faktur+" err "+err);
        //insert jurnal
        let sql = "INSERT INTO jurnal (tanggal, faktur, keterangan, admin, jurnal_ts) value(?, ?, ?, ?, ?)";
        let tglInsert = params.tanggal.split("-").reverse().join("-");
        let arrInsert = [tglInsert, faktur, params.keterangan, req.session.users.admin_id, common.now()];
        //common.log("arr insert "+JSON.stringify(arrInsert));
        connection.query(sql, arrInsert, function(err, rows, fields){
          if(err){
            common.log("insert "+err);
            connection.rollback(function(){
              throw err;
              return;
            });
          }else{
            modelJurnal.tmpJurnal(kode, req.session.users.admin_id, rows.insertId, function(err, data){
              if(kode == 'JR'){
                modelBB.insertBB(rows.insertId, tglInsert, function(err, respB){
                  connection.commit(function(err){
                    if(err){
                      connection.rollback(function(){
                        throw err;
                        return;
                      });
                    }
                  });
                  res.redirect('/transaksi/jurnal/'+kode+'?dmy1='+params.tanggal);
                  return;
                });
              }else{
                sql = "INSERT INTO jurnal_detail (jurnal, akun_perkiraan, debit, kredit) value(?, ?, ?, ?)";
                arrInsert = [rows.insertId, req.session.users.akun_id, data.debit, data.kredit];
                connection.query(sql, arrInsert, function(err, rowsI, fields){
                  if(err){
                    common.log("INSERT "+err);
                    connection.rollback(function(){
                      throw err;
                      return;
                    });
                  }else{
                    modelBB.insertBB(rows.insertId, tglInsert, function(err, respB){
                      connection.commit(function(err){
                        if(err){
                          connection.rollback(function(){
                            throw err;
                            return;
                          });
                        }
                      });
                      res.redirect('/transaksi/kas/'+kode+'?dmy1='+params.tanggal);
                    });
                  }
                });
              }
            });
          }
        });
      });
    });
  }
};

let deleteTmp = function(req, res, next){
  let kode = req.params.kode;
  let params  = req.body;
  common.log("data post "+JSON.stringify(req.body));
  let sql = "DELETE FROM jurnal_tmp WHERE admin=? and akun_perkiraan=? and tipe_jurnal='kas_masuk'";
  if(kode == 'KK') sql = "DELETE FROM jurnal_tmp WHERE admin=? and akun_perkiraan=? and tipe_jurnal='kas_keluar'";
  if(kode == 'JR') sql = "DELETE FROM jurnal_tmp WHERE admin=? and akun_perkiraan=? and tipe_jurnal='jurnal_lain'";
  connection.query(sql, [req.session.users.admin_id, params.akun_perkiraan], function(err, rows, fields){
    if(err){
      common.log("delete "+err);
      next();
    }else{
      res.json({
        status: 'success',
        message: 'Data sudah terhapus'
      })
    }
  });
};

exports.add = addJurnal;
exports.delTmp = deleteTmp;
