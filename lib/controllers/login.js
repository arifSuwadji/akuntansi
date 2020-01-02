'use strict';

const sha1 = require('sha1');
const uuidv4 = require('uuid/v4');

const connection = require('../db');
const common = require('../common');
const config = require('../../lib/config.json');

let getLogin = function(req, res, next){
  res.render('login.html');
};

let logout = function(req, res, next){
  delete req.session.users;
  res.redirect('/');
};

let actionLogin = function(req, res, next){
  let username = req.body.username;
  let password = sha1(req.body.password);

  let sql = "SELECT * from admin INNER JOIN admin_grup on admin_grup.grup_id = admin.admin_grup LEFT JOIN akun_perkiraan on akun_perkiraan.akun_id = admin.akun_perkiraan where username=? and password=?";
  connection.query(sql, [username, password], function(err, rows, fields){
    if(err){
      common.log("query : "+ err);
      next();
      return;
    }else if(!rows[0]){
      common.log("no match row");
      next();
      return;
    }else{
      common.log('login berhasil');
      let lastSession = uuidv4();
      let userLogin =  {
        session_id: lastSession,
        admin_id: rows[0].admin_id,
        username: rows[0].username,
        nama_lengkap: rows[0].nama_lengkap,
        nama_grup: rows[0].nama_grup,
        grup_id: rows[0].grup_id,
        akun_id: rows[0].akun_perkiraan,
        kode_akun: rows[0].kode_akun,
        nama_akun: rows[0].nama_akun,
        webVersion: config.webui.version
      };
      req.session.users = userLogin;
      let updateSql = "UPDATE admin set session_id=?, akses_terakhir=? where username=? and status='aktif'";
      connection.query(updateSql, [lastSession, common.now(),rows[0].username], function(error, results, cb){
        if(error){
          common.log("update login "+error);
        }else{
          common.log("update login berhasil");
        }
      });
      res.redirect('/dashboard');
    }
  });
};

exports.view = getLogin;
exports.action = actionLogin;
exports.out = logout;
