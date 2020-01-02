'use strict'

const connection = require('../../db');
const common = require('../../common');

let grup = [];
let addView = function(req, res, next){
  connection.query('SELECT grup_id, nama_grup FROM admin_grup', function(err, rows, fields){
    if(err){
      common.log("select "+err);
      throw err;
      //next();
    }else{
      grup.splice(0, grup.length);
      for(var i=0; i < rows.length; i++){
        grup.push(rows[i]);
      }
      next();
    }
  });
}

let dataOne = [];
let dataPerson = function(req, res, next){
  let sql = 'SELECT * FROM admin WHERE admin_id=?';
  connection.query(sql, [req.params.id], function(err, rows, fields){
    if(err){
      common.log("select "+err);
      throw err;
    }else{
      dataOne.splice(0, dataOne.length);
      for(var i=0; i < rows.length; i++){
        dataOne.push(rows[i]);
      }
      next();
    }
  });
}

let listView = [];
let listCount = [];
let dataAdmin = function(req, res, next){
  let start = parseInt(req.query.start);
  let length = parseInt(req.query.length);
  let value = req.query.search.value;
  value += "%";
  let column = parseInt(req.query.order[0].column);
  let sort = req.query.order[0].dir;

  let countSql = 'SELECT *, COUNT(*) AS countAdmin FROM admin INNER JOIN admin_grup on admin_grup.grup_id = admin.admin_grup WHERE username like ? or nama_lengkap like ? or nama_grup like ?';
  connection.query(countSql, [value, value, value], function(err, rows, fields){
    if(err){
      common.log("count admin "+err);
      throw err;
    }else{
      listCount.splice(0, listCount.length);
      listCount.push({count: rows[0].countAdmin});
    }
  });

  let sql = "SELECT *, case status when 'aktif' then 'Aktif' when 'tidak' then 'Tidak Aktif' end as status_admin FROM admin INNER JOIN admin_grup on admin_grup.grup_id = admin.admin_grup LEFT JOIN akun_perkiraan on akun_perkiraan.akun_id = admin.akun_perkiraan WHERE username like ? or nama_lengkap like ? or nama_grup like ? order by admin_id asc LIMIT ?,?";
  if(sort == 'desc')
  sql = "SELECT *, case status when 'aktif' then 'Aktif' when 'tidak' then 'Tidak Aktif' end as status_admin FROM admin INNER JOIN admin_grup on admin_grup.grup_id = admin.admin_grup LEFT JOIN akun_perkiraan on akun_perkiraan.akun_id = admin.akun_perkiraan WHERE username like ? or nama_lengkap like ? or nama_grup like ? order by admin_id desc LIMIT ?,?";
  if(column == 1){
    sql = "SELECT *, case status when 'aktif' then 'Aktif' when 'tidak' then 'Tidak Aktif' end as status_admin FROM admin INNER JOIN admin_grup on admin_grup.grup_id = admin.admin_grup LEFT JOIN akun_perkiraan on akun_perkiraan.akun_id = admin.akun_perkiraan WHERE username like ? or nama_lengkap like ? or nama_grup like ? order by username asc LIMIT ?,?";
    if(sort == 'desc')
    sql = "SELECT *, case status when 'aktif' then 'Aktif' when 'tidak' then 'Tidak Aktif' end as status_admin FROM admin INNER JOIN admin_grup on admin_grup.grup_id = admin.admin_grup LEFT JOIN akun_perkiraan on akun_perkiraan.akun_id = admin.akun_perkiraan WHERE username like ? or nama_lengkap like ? or nama_grup like ? order by username desc LIMIT ?,?";
  }else if(column == 2){
    sql = "SELECT *, case status when 'aktif' then 'Aktif' when 'tidak' then 'Tidak Aktif' end as status_admin FROM admin INNER JOIN admin_grup on admin_grup.grup_id = admin.admin_grup LEFT JOIN akun_perkiraan on akun_perkiraan.akun_id = admin.akun_perkiraan WHERE username like ? or nama_lengkap like ? or nama_grup like ? order by nama_lengkap asc LIMIT ?,?";
    if(sort == 'desc')
    sql = "SELECT *, case status when 'aktif' then 'Aktif' when 'tidak' then 'Tidak Aktif' end as status_admin FROM admin INNER JOIN admin_grup on admin_grup.grup_id = admin.admin_grup LEFT JOIN akun_perkiraan on akun_perkiraan.akun_id = admin.akun_perkiraan WHERE username like ? or nama_lengkap like ? or nama_grup like ? order by nama_lengkap desc LIMIT ?,?";
  }else if(column == 3){
    sql = "SELECT *, case status when 'aktif' then 'Aktif' when 'tidak' then 'Tidak Aktif' end as status_admin FROM admin INNER JOIN admin_grup on admin_grup.grup_id = admin.admin_grup LEFT JOIN akun_perkiraan on akun_perkiraan.akun_id = admin.akun_perkiraan WHERE username like ? or nama_lengkap like ? or nama_grup like ? order by nama_grup asc LIMIT ?,?";
    if(sort == 'desc')
    sql = "SELECT *, case status when 'aktif' then 'Aktif' when 'tidak' then 'Tidak Aktif' end as status_admin FROM admin INNER JOIN admin_grup on admin_grup.grup_id = admin.admin_grup LEFT JOIN akun_perkiraan on akun_perkiraan.akun_id = admin.akun_perkiraan WHERE username like ? or nama_lengkap like ? or nama_grup like ? order by nama_grup desc LIMIT ?,?";
  }
  connection.query(sql, [value, value, value, start,length], function(err, rows, fields){
    if(err){
      common.log("list admin "+err);
      throw err;
    }else{
      listView.splice(0, listView.length);
      for(var i=0; i < rows.length; i++){
        start++;
        rows[i].hitung = start;
        listView.push(rows[i]);
      }
      next();
    }
  });
}

exports.add = addView;
exports.dataGrup = grup;
exports.list = dataAdmin;
exports.listView = listView;
exports.listCount = listCount;
exports.dataPerson = dataPerson;
exports.dataOne = dataOne;
