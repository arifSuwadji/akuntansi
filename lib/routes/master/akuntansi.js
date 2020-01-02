"use strict";

const express = require('express');
const router = express.Router();

const common = require('../../common');

const akun = require('../../controllers/master/akun');
const modelAkun = require('../../models/master/akun');

router.get('/',function(req, res, next){
  //res.send('Master Home Page');
  //res.render('master/index.html', {user:"Jojons"});
  //res.redirect('/master/admin/list');
  throw new Error("BROKEN");
});

router.get('/akun', function(req, res, next){
  let data = {
    sessionUsers : req.session.users,
    title : 'Akun Perkiraan',
    filejs : '/komodojs'+req.originalUrl+'.js',
    dmy1: common.date(),
    dmy2: common.date(),
  }
  res.render('master/akuntansi/listAkun.html', data);
});

router.get('/akunJson', modelAkun.list, function(req, res, next){
  let draw = parseInt(req.query.draw);
  let response = {
    "draw" :draw,
    "recordsTotal": modelAkun.listCount[0].count,
    "recordsFiltered": modelAkun.listCount[0].count,
    "data": modelAkun.listView
  };
  res.json(response);
});

router.route('/addakun')
.get(function(req, res, next){
  let data = {
    sessionUsers: req.session.users,
    title: 'Tambah Akun Perkiraan',
    filejs : '/komodojs/master/akuntansi/addAkun.js',
    dmy1: common.date(),
    dmy2: common.date(),
  };
  res.render('master/akuntansi/addAkun.html', data);
}).post([akun.add], function(req, res, next){
  res.json({
    status: 'Failed',
    message: 'Koneksi database terputus'
  });
});

router.route('/editakun/:id')
.get([modelAkun.id], function(req, res, next){
  let data = {
    sessionUsers: req.session.users,
    title: 'Edit Akun Perkiraan',
    results: modelAkun.idOne,
    filejs: '/komodojs/master/akuntansi/editAkun.js',
    dmy1: common.date(),
    dmy2: common.date(),
  };
  if(req.session.users.grup_id == 1){
    res.render('master/akuntansi/editAkun.html', data);
  }else{
    res.redirect('/master/akuntansi/akun');
  }
}).post([akun.edit], function(req, res, next){
  res.json({
    status: 'Failed',
    message: 'Koneksi database terputus'
  });
});

router.post('/delete/:id', [akun.delete], function(req, res, next){
  common.log("id "+req.params.id);
  res.json({
    status: 'failed',
    message: 'koneksi database terputus',
  });
});

module.exports = router;
