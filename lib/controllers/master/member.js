"use strict";

const common = require("../../common");

const modelMember = require("../../models/master/member");

exports.index = function (req, res, next) {
  // body...
  let data = {
    sessionUsers : req.session.users,
    title : 'Data Member',
    filejs : '/komodojs'+req.originalUrl+'.js',
    dmy1: common.date(),
    dmy2: common.date(),
  }
  res.render('master/member/listMember.html', data);
};

exports.data = async function (req, res, next) {
  // body...
  let recordsTotal = 0;
  let recordsFiltered = 0;
  await new Promise(function(resolve, reject) {
    modelMember.count(req, function(err, data){
      if(err){
        common.log(data);
        resolve();
      }else{
        recordsTotal = data;
        recordsFiltered = data;
        resolve();
      }
    });
  });

  let listMember = [];
  await new Promise(function(resolve, reject) {
    modelMember.list(req, function(err, data){
      if(err){
        common.log(data);
        resolve();
      }else{
        listMember = data;
        resolve();
      }
    });
  });

  let draw = parseInt(req.query.draw);
  let response = {
    "draw" : draw,
    "recordsTotal": recordsTotal,
    "recordsFiltered": recordsFiltered,
    "data": listMember
  }
  res.json(response);
};

exports.mutasiHutang = function (req, res, next) {
  // body...
  let data = {
    sessionUsers : req.session.users,
    title : 'Mutasi Hutang',
    titleKas: 'Member '+req.params.nama,
    memberID: req.params.memberID,
    filejs : '/komodojs/master/member/mutasiHutang.js',
    dmy1: common.date(),
    dmy2: common.date(),
  }
  res.render('master/member/mutasiHutang.html', data);
};

exports.mutasiHutangJson = async function (req, res, next) {
  // body...
  let recordsTotal = 0;
  let recordsFiltered = 0;
  //hitung deposit hutang
  await new Promise(function(resolve, reject) {
    modelMember.countMutasiHutangDepositByMember(req, function(err, data){
      if(err){
        common.log(data);
        resolve();
      }else{
        recordsTotal = data;
        recordsFiltered = data;
        resolve();
      }
    });
  });

  //hitung bayar hutang
  await new Promise(function(resolve, reject) {
    modelMember.countMutasiBayarHutangDepositByMember(req, function(err, data){
      if(err){
        common.log(data);
        resolve();
      }else{
        recordsTotal = recordsTotal + data;
        recordsFiltered = recordsTotal + data;
        resolve();
      }
    })
  });

  let listMutasiHutang = [];
  let listMutasiHutangDeposit = [];
  await new Promise(function(resolve, reject) {
    modelMember.listMutasiHutangDepositByMember(req, function(err, data){
      if(err){
        common.log(data);
        resolve();
      }else{
        listMutasiHutangDeposit = data;
        resolve();
      }
    });
  });

  let listMutasiBayarHutangDeposit = [];
  await new Promise(function(resolve, reject) {
    modelMember.listMutasiBayarHutangDepositByMember(req, function(err, data){
      if(err){
        common.log(data);
        resolve();
      }else{
        listMutasiBayarHutangDeposit = data;
        resolve();
      }
    });
  });

  let listMutasiHutangTmp = [];
  await new Promise(function(resolve, reject) {
    if(listMutasiHutangDeposit.length > 0){
      for(let i=0; i < listMutasiHutangDeposit.length; i++){
        let list = listMutasiHutangDeposit[i];
        let data = {tanggal: list.tsView, id: list.deposit_id, tipe: 'hutang deposit', debit: 0, kredit: list.nominal, saldo: list.jumlah}
        listMutasiHutangTmp.push(data);
      }
    }
    //let data = {tanggal: '2019-07-19 13:44:28', id: 14, tipe: 'hutang deposit', debit:0, kredit: 1000000, saldo:1085000}
    //listMutasiHutangTmp.push(data);
    if(listMutasiBayarHutangDeposit.length > 0){
      for(let i=0; i < listMutasiBayarHutangDeposit.length; i++){
        let list = listMutasiBayarHutangDeposit[i];
        let data = {tanggal: list.tsView, id: list.bayar_id, tipe: 'bayar hutang', debit: list.nominal, kredit: 0, saldo: list.jumlah};
        listMutasiHutangTmp.push(data);
      }
    }

    listMutasiHutang = listMutasiHutangTmp.sort(dynamicSort("tanggal"));
    resolve();
  });

  let draw = parseInt(req.query.draw);
  let response = {
    "draw" :draw,
    "recordsTotal": recordsTotal,
    "recordsFiltered": recordsTotal,
    "data": listMutasiHutang
  };
  res.json(response);
};

function dynamicSort(property) {
    var sortOrder = 1;

    if(property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }

    return function (a,b) {
        if(sortOrder == -1){
            return b[property].localeCompare(a[property]);
        }else{
            return a[property].localeCompare(b[property]);
        }
    }
}
