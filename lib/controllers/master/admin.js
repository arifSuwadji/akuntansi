"use strict"

const sha1 = require('sha1');

const connection = require('../../db');
const common = require('../../common');

let addAdmin = function(req, res, next){
  let params = req.body;
  common.log("data post "+JSON.stringify(req.body));

  let sql = "INSERT INTO admin (username, password, nama_lengkap, admin_grup, akun_perkiraan) value (?, ?, ?, ?, ?)";
  connection.query(sql, [params.username, sha1(params.password), params.nama_lengkap, params.admin_grup, params.akun_perkiraan], function(err, rows, fields){
    if(err){
      common.log("insert : "+ err);
      next();
      return;
    }else{
      common.log('insert data admin berhasil');
      res.redirect('/master/admin/list');
    }
  });
}

let editAdmin = function(req, res, next){
  let params = req.body;
  common.log("id admin update "+req.params.id);
  common.log("data post "+JSON.stringify(req.body));
  let arrUpdate = [params.nama_lengkap, params.username, req.params.id];
  let sql = "UPDATE admin SET nama_lengkap=?, username=? WHERE admin_id=?";
  if(params.password){
    arrUpdate = [params.nama_lengkap, params.username, sha1(params.password), req.params.id];
    sql = "UPDATE admin SET nama_lengkap=?, username=?, password=? WHERE admin_id=?";
  }else if(params.admin_grup){
    arrUpdate = [params.admin_grup, params.nama_lengkap, params.username, params.status, params.akun_perkiraan, req.params.id];
    sql = "UPDATE admin SET admin_grup=?, nama_lengkap=?, username=?, status=?, akun_perkiraan=? WHERE admin_id=?";
    if(params.password){
      arrUpdate = [params.admin_grup, params.nama_lengkap, params.username, params.status, sha1(params.password), params.akun_perkiraan, req.params.id];
      sql = "UPDATE admin SET admin_grup=?, nama_lengkap=?, username=?, status=?, password=?, akun_perkiraan=? WHERE admin_id=?";
    }
  }
  connection.query(sql, arrUpdate, function(err, rows, fields){
    if(err){
      common.log("update "+err);
      next();
      return;
    }else{
      common.log("update data admin berhasil");
      res.redirect('/master/admin/list');
    }
  })
}

let deleteAdmin = function(req, res, next){
  common.log("id admin delete "+req.params.id);
  if(req.session.users.grup_id == 1){
    let sql = "DELETE FROM admin WHERE admin_id=?";
    connection.query(sql, [req.params.id], function(err, row, fields){
      if(err){
        common.log("delete "+err);
        next();
        return;
      }else{
        res.json({
          status:'success',
          message: 'Admin '+req.params.id+' telah didelete'
        });
      }
    });
  }else{
    res.json({
      status: 'failed',
      message: 'Admin '+req.params.id+' tidak terhapus'
    });
  }
}

exports.addAction = addAdmin;
exports.editAction = editAdmin;
exports.deleteAction = deleteAdmin;
