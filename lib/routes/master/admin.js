"use strict";

const express = require('express');
const router = express.Router();

const common = require('../../common');

const admin = require('../../controllers/master/admin');
const modelAdmin = require('../../models/master/admin');
const modelAkun = require('../../models/master/akun');

router.get('/', function(req, res, next){
  res.redirect('/master/admin/list');
});

router.get('/list', function(req, res, next){
  let data = {
    sessionUsers : req.session.users,
    title : 'Daftar Admin',
    filejs : '/komodojs'+req.originalUrl+'.js',
    dmy1: common.date(),
    dmy2: common.date(),
  }
  res.render('master/admin/listAdmin.html', data);
});

router.get('/listJson', modelAdmin.list, function(req, res, next){
  let draw = parseInt(req.query.draw);
  let response = {
    "draw" :draw,
    "recordsTotal": modelAdmin.listCount[0].count,
    "recordsFiltered": modelAdmin.listCount[0].count,
    "data": modelAdmin.listView
  };
  res.json(response);
});

router.route('/add')
.get([modelAdmin.add, modelAkun.akunSelect], function(req, res, next){
  let data = {
    sessionUsers: req.session.users,
    title: 'Tambah Admin',
    results: modelAdmin.dataGrup,
    resultsSecond: modelAkun.select,
    filejs : '/komodojs'+req.originalUrl+'.js',
    dmy1: common.date(),
    dmy2: common.date(),
  };
  res.render('master/admin/addAdmin.html', data);
}).post(admin.addAction, function(req, res, next){
  res.json({
    status: 'Failed',
    message: 'Koneksi database terputus'
  });
});

router.route('/edit/:id')
.get([modelAdmin.add, modelAdmin.dataPerson, modelAkun.akunSelect], function(req, res, next){
  let data ={
    sessionUsers: req.session.users,
    title: 'Edit Admin',
    grupID: req.query.grup_id,
    adminID: req.params.id,
    results: modelAdmin.dataGrup,
    resultsSecond: modelAdmin.dataOne,
    resultsThird: modelAkun.select,
    filejs : '/komodojs/master/admin/edit.js',
    dmy1: common.date(),
    dmy2: common.date(),
  }
  if(req.session.users.grup_id == 1 || req.session.users.admin_id == req.params.id){
    if(req.session.users.grup_id == 1){
      data.filejs = '/komodojs/master/admin/editall.js';
    }
    res.render('master/admin/editAdmin.html', data);
  }else{
    res.redirect('/master/admin/list');
  }
}).post([admin.editAction], function(req, res, next){
  common.log("id "+req.params.id);
  res.json({
    status: 'failed',
    message: 'koneksi database terputus'
  });
})

router.post('/delete/:id', [admin.deleteAction], function(req, res, next){
  common.log("id "+req.params.id);
  res.json({
    status: 'failed',
    message: 'koneksi database terputus',
  });
});

module.exports = router;
