'use strict'

const connection = require('../../db');
const common = require('../../common');

let listView = [];
let listCount = [];
let dataAkun = function(req, res, next){
  let start = parseInt(req.query.start);
  let length = parseInt(req.query.length);
  let value = req.query.search.value;
  let arrValue = value.split("_");
  value = arrValue[0]+"%";
  let column = parseInt(req.query.order[0].column);
  let sort = req.query.order[0].dir;

  let countSql = 'SELECT *, COUNT(*) AS countAkun FROM akun_perkiraan WHERE kode_akun like ? or nama_akun like ? or tipe_akun like ?';
  connection.query(countSql, [value, value, value], function(err, rows, fields){
    if(err){
      common.log("count akun "+err);
      throw err;
    }else{
      listCount.splice(0, listCount.length);
      listCount.push({count: rows[0].countAkun});
    }
  });

  let sql = "SELECT *, case tipe_akun when 'induk' then 'Induk' when 'detail' then 'Detail' end as nama_tipe_akun FROM akun_perkiraan WHERE kode_akun like ? or nama_akun like ? or tipe_akun like ? order by akun_id asc LIMIT ?,?";
  if(sort == 'desc')
  sql = "SELECT *, case tipe_akun when 'induk' then 'Induk' when 'detail' then 'Detail' end as nama_tipe_akun FROM akun_perkiraan WHERE kode_akun like ? or nama_akun like ? or tipe_akun like ? order by akun_id desc LIMIT ?,?";
  if(column == 1){
    sql = "SELECT *, case tipe_akun when 'induk' then 'Induk' when 'detail' then 'Detail' end as nama_tipe_akun FROM akun_perkiraan WHERE kode_akun like ? or nama_akun like ? or tipe_akun like ? order by kode_akun asc LIMIT ?,?";
    if(sort == 'desc')
    sql = "SELECT *, case tipe_akun when 'induk' then 'Induk' when 'detail' then 'Detail' end as nama_tipe_akun FROM akun_perkiraan WHERE kode_akun like ? or nama_akun like ? or tipe_akun like ? order by kode_akun desc LIMIT ?,?";
  }else if(column == 2){
    sql = "SELECT *, case tipe_akun when 'induk' then 'Induk' when 'detail' then 'Detail' end as nama_tipe_akun FROM akun_perkiraan WHERE kode_akun like ? or nama_akun like ? or tipe_akun like ? order by nama_akun asc LIMIT ?,?";
    if(sort == 'desc')
    sql = "SELECT *, case tipe_akun when 'induk' then 'Induk' when 'detail' then 'Detail' end as nama_tipe_akun FROM akun_perkiraan WHERE kode_akun like ? or nama_akun like ? or tipe_akun like ? order by nama_akun desc LIMIT ?,?";
  }else if(column == 3){
    sql = "SELECT *, case tipe_akun when 'induk' then 'Induk' when 'detail' then 'Detail' end as nama_tipe_akun FROM akun_perkiraan WHERE kode_akun like ? or nama_akun like ? or tipe_akun like ? order by tipe_akun asc LIMIT ?,?";
    if(sort == 'desc')
    sql = "SELECT *, case tipe_akun when 'induk' then 'Induk' when 'detail' then 'Detail' end as nama_tipe_akun FROM akun_perkiraan WHERE kode_akun like ? or nama_akun like ? or tipe_akun like ? order by tipe_akun desc LIMIT ?,?";
  }
  connection.query(sql, [value, value, value, start,length], function(err, rows, fields){
    if(err){
      common.log("list akun "+err);
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
};

let dataOne = [];
let idAkun = function(req, res, next){
  let sql = "SELECT * FROM akun_perkiraan WHERE akun_id=?";
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
};

let dataOption = [];
let akunOption = function(req, res, next){
  let sql = "SELECT * FROM akun_perkiraan WHERE tipe_akun='detail' order by kode_akun";
  connection.query(sql, function(err, rows, fields){
    if(err){
      common.log("select "+err);
      throw err;
    }else{
      dataOption.splice(0, dataOption.length);
      for(var i=0; i < rows.length; i++){
        dataOption.push(rows[i]);
      }
      next();
    }
  });
};

exports.list = dataAkun;
exports.listView = listView;
exports.listCount = listCount;
exports.id = idAkun;
exports.idOne = dataOne;
exports.akunSelect = akunOption;
exports.select = dataOption;
