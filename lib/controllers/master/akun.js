"use strict"

const connection = require('../../db');
const common = require('../../common');

let addAkun = function(req, res, next){
  let params = req.body;
  common.log("data post "+JSON.stringify(req.body));
  let kode = params.kode_akun;
  let arrKode = kode.split("_");
  let kode_akun = arrKode[0].replace(/\.$/,"");

  let sql = "INSERT INTO akun_perkiraan (kode_akun, nama_akun, tipe_akun) value(?, ?, ?)";
  connection.query(sql, [kode_akun, params.nama_akun, params.tipe_akun], function(err, rows, fields){
    if(err){
      common.log('add akun '+err);
      throw err;
    }else{
      common.log('add akun berhasil');
      res.redirect('/master/akuntansi/akun');
    }
  });
};

let editAkun = function(req, res, next){
  let params = req.body;
  common.log("data post "+JSON.stringify(req.body));
  let kode = params.kode_akun;
  let arrKode = kode.split("_");
  let kode_akun = arrKode[0].replace(/\.$/,"");

  let sql = "UPDATE akun_perkiraan SET kode_akun=?, nama_akun=?, tipe_akun=? WHERE akun_id=?";
  connection.query(sql, [kode_akun, params.nama_akun, params.tipe_akun, req.params.id], function(err, rows, fields){
    if(err){
      common.log('update akun '+err);
      throw err;
    }else{
      common.log('update akun berhasil');
      res.redirect('/master/akuntansi/akun');
    }
  });
};

let deleteAkun = function(req, res, next){
  common.log("id akun delete "+req.params.id);
  if(req.session.users.grup_id == 1){
    let sql = "DELETE FROM akun_perkiraan WHERE akun_id=?";
    connection.query(sql, [req.params.id], function(err, row, fields){
      if(err){
        common.log("delete "+err);
        next();
        return;
      }else{
        res.json({
          status:'success',
          message: 'Akun '+req.params.id+' telah didelete'
        });
      }
    });
  }else{
    res.json({
      status: 'failed',
      message: 'Akun '+req.params.id+' tidak terhapus'
    });
  }
}

exports.add = addAkun;
exports.edit = editAkun;
exports.delete = deleteAkun;
