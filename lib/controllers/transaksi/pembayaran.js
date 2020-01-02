"use strict";

const common = require("../../common");
const connection = require("../../db");

const modelPembayaran = require("../../models/transaksi/pembayaran");
const modelFaktur = require('../../models/transaksi/nomor_faktur');
const modelJurnal = require('../../models/transaksi/jurnalTransaksi');
const modelBB = require('../../models/transaksi/bukubesar');

exports.index = function (req, res, next) {
  // body...
  let urlP = req.originalUrl.split(/\?/);
  let data = {
    sessionUsers : req.session.users,
    title : 'Pembayaran Hutang',
    filejs : '/komodojs/transaksi/pembayaran_hutang.js',
    dmy1: req.query.dmy1,
    dmy2: req.query.dmy1,
    urlPost: urlP[0],
  }
  res.render('transaksi/pembayaran_hutang.html', data);
};

exports.action = async function (req, res,next) {
  // body...
  common.log("body "+JSON.stringify(req.body));
  let params = req.body;

  //begin transaction
  await new Promise(function(resolve, reject) {
    connection.beginTransaction(async function(err){
      if(err){
        common.log("begin "+err.message);
        res.redirect('/transaksi/pembayaran_hutang?dmy1='+params.tanggal+'&errmsg='+err.message);
        return;
      }else{
        resolve();
      }
    });
  });

  //get faktur
  let faktur = null;
  await new Promise(function(resolve, reject) {
    let tanggal = params.tanggal;
    common.log("tanggal pembayaran "+tanggal);
    //let tglFaktur = tanggal.getFullYear()+'-'+common.pad_with_zeroes((tanggal.getMonth()+1),2)+'-'+tanggal.getDate();
    let tglFaktur = params.tanggal;
    common.log("tanggal faktur "+tglFaktur);
    modelFaktur.genFaktur('PH', tglFaktur, function(err, data){
      if(err){
        common.log("gen faktur "+err+" data "+data);
        connection.rollback(function(){
          common.log("rollback ");
        });
        res.redirect('/transaksi/pembayaran_hutang?dmy1='+params.tanggal+'&errmsg='+data);
        return;
      }else{
        faktur = data;
        resolve();
      }
    });
  });

  //insert jurnal
  let jurnalId = null;
  await new Promise(function(resolve, reject) {
    modelJurnal.insert(params.tanggal, params.keterangan, null, faktur, req.session.users.admin_id, function(err, data){
      if(err){
        common.log("insert jurnal "+err+" data "+data);
        connection.rollback(function(){
          common.log("rollback");
        });
        res.redirect('/transaksi/pembayaran_hutang?dmy1='+params.tanggal+'&errmsg='+data);
        return;
      }else{
        jurnalId = data;
        resolve();
      }
    })
  });

  if(jurnalId){
    //jurnal detail debit
    let nominal = params.nominal;
    nominal = nominal.replace(/,/g,"");
    await new Promise(function(resolve, reject) {
      modelJurnal.insertDetail(jurnalId, params.akun_debit, nominal, 0, function(err, data){
        if(err){
          common.log("insert detail "+data);
          connection.rollback(function(){
            common.log("rollback");
          });
          res.redirect('/transaksi/pembayaran_hutang?dmy1='+params.tanggal+'&errmsg='+data);
          return;
        }else{
          resolve();
        }
      })
    });

    //jurnal detail kredit
    await new Promise(function(resolve, reject) {
      modelJurnal.insertDetail(jurnalId, params.akun_kredit, 0, nominal, function(err, data){
        if(err){
          common.log("insert detail "+data);
          connection.rollback(function(){
            common.log("rollback");
          });
          res.redirect('/transaksi/pembayaran_hutang?dmy1='+params.tanggal+'&errmsg='+data);
          return;
        }else{
          resolve();
        }
      })
    });

    //insert buku besar
    await new Promise(function(resolve, reject) {
      let tanggal = params.tanggal;
      modelBB.insertBB(jurnalId, tanggal, function(err, data){
        if(err){
          common.log("insert bb "+data);
          connection.rollback(function(){
            common.log("rollback");
          });
          res.json({status: 'failed', message: data});
          return;
        }else{
          resolve();
        }
      });
    });

    //insert pembayaran_hutang
    let bayarId = null;
    await new Promise(function(resolve, reject) {
      modelPembayaran.insertBayar(params, req.session.users.admin_id, jurnalId, function(err,data){
        if(err){
          common.log("insert detail "+data);
          connection.rollback(function(){
            common.log("rollback");
          });
          res.redirect('/transaksi/pembayaran_hutang?dmy1='+params.tanggal+'&errmsg='+data);
          return;
        }else{
          bayarId = data;
          resolve();
        }
      })
    });
    common.log("bayar ID "+bayarId);

    if(bayarId){
      //data member
      let dataMember = [];
      await new Promise(function(resolve, reject) {
        modelPembayaran.dataMemberById(params.member, function(err, data){
          if(err){
            common.log("query data member "+data);
            connection.rollback(function(){
              common.log("rollback");
            });
            res.redirect('/transaksi/pembayaran_hutang?dmy1='+params.tanggal+'&errmsg='+data);
            return;
          }else{
            dataMember = data;
            resolve();
          }
        });
      });
      common.log("data member "+dataMember[0].member_id);

      //insert mutasi member
      let nominal = params.nominal;
      nominal = nominal.replace(/,/g,"");
      let jumlah = parseInt(dataMember[0].saldo_hutang) - parseInt(nominal);
      common.log("nominal hutang "+nominal);
      common.log("saldo hutang "+dataMember[0].saldo_hutang);
      common.log("jumlah akhir  "+jumlah);
      await new Promise(function(resolve, reject) {
        modelPembayaran.mutasiHutang(dataMember[0].member_id, bayarId, -nominal, jumlah, function(err, data){
          if(err){
            connection.rollback(function(){
              common.log("rollback "+data);
            });
            res.redirect('/transaksi/pembayaran_hutang?dmy1='+params.tanggal+'&errmsg='+data);
            return;
          }else{
            resolve();
          }
        });
      });

      //update saldo Hutang
      await new Promise(function(resolve, reject) {
        modelPembayaran.updateSaldoHutang(dataMember[0].member_id, jumlah, function(err, data){
          if(err){
            connection.rollback(function(){
              common.log("rollback "+data);
            });
            res.json({ status: 'failed', message: data});
            return;
          }else{
            resolve();
          }
        })
      });
    }else{
      connection.rollback(function(){
        common.log("rollback "+data);
      });
    }
  }else{
    connection.rollback(function(){
      common.log("rollback "+data);
    });
  }

  //commit
  await new Promise(function(resolve, reject) {
    connection.commit(function(err){
      if(err){
        connection.rollback(function(){
          common.log("commit error "+err.message);
        });
      }else{
        resolve();
      }
    })
  });

  res.redirect('/transaksi/pembayaran_hutang?dmy1='+params.tanggal);
};

exports.dataMember = async function (req, res, next) {
  // body...
  let listMember = [];
  await new Promise(function(resolve, reject) {
    modelPembayaran.dataMember(function(err, data){
      if(!err){
        res.json({status: 'success', message: data});
        return;
      }
    })
  });
};

exports.dataFaktur = function (req, res, next) {
  // body...
};

exports.saldoMember = async function (req, res, next) {
  // body...
  let saldo = 0;
  await new Promise(function(resolve, reject) {
    modelPembayaran.saldoMember(req.params.memberID, function(err, data){
      if(!err){
        saldo = data;
      }
      res.json({status: 'success', message: saldo});
      return;
    })
  });
};

exports.akun = async function (req, res, next) {
  // body...
  await new Promise(function(resolve, reject) {
    modelPembayaran.akunSelect(function(err, data){
      if(!err){
        res.json({status: 'success', message: data});
        return;
      }
    })
  });
};

exports.faktur = async function (req, res, next) {
  // body...
  await new Promise(function(resolve, reject) {
    modelPembayaran.dataFaktur(req, function(err, data){
      if(err){
        common.log("gen faktur "+err+" data "+data);
        connection.rollback(function(){
          common.log("rollback ");
        });
        res.json({status: 'failed', message: data});
        return;
      }else{
        common.log("nomor faktur "+data);
        res.json({status: '', message: data});
      }
    });
  });
};
