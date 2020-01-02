"use strict";

const common = require("../../common");
const connection = require("../../db");

const modelPembelian = require("../../models/transaksi/pembelian");
const modelFaktur = require('../../models/transaksi/nomor_faktur');
const modelJurnal = require('../../models/transaksi/jurnalTransaksi');
const modelBB = require('../../models/transaksi/bukubesar');

exports.index = function (req, res, next) {
  // body...
  let urlP = req.originalUrl.split(/\?/);
  let data = {
    sessionUsers : req.session.users,
    title : 'Pembelian',
    filejs : '/komodojs/transaksi/pembelian.js',
    dmy1: req.query.dmy1,
    dmy2: req.query.dmy1,
    urlPost: urlP[0],
  }
  res.render('transaksi/pembelian.html', data);
};

exports.action = async function (req, res, next) {
  // body...
  common.log("body "+JSON.stringify(req.body));
  let params = req.body;

  //begin transaction
  await new Promise(function(resolve, reject) {
    connection.beginTransaction(async function(err){
      if(err){
        common.log("begin "+err.message);
        res.redirect('/transaksi/pembelian?dmy1='+params.tanggal+'&errmsg='+err.message);
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
    common.log("tanggal pembelian "+tanggal);
    //let tglFaktur = tanggal.getFullYear()+'-'+common.pad_with_zeroes((tanggal.getMonth()+1),2)+'-'+tanggal.getDate();
    let tglFaktur = params.tanggal;
    common.log("tanggal faktur "+tglFaktur);
    modelFaktur.genFaktur('PB', tglFaktur, function(err, data){
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
        res.redirect('/transaksi/pembelian?dmy1='+params.tanggal+'&errmsg='+data);
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
          common.log("insert detail debit"+data);
          connection.rollback(function(){
            common.log("rollback");
          });
          res.redirect('/transaksi/pembelian?dmy1='+params.tanggal+'&errmsg='+data);
          return;
        }else{
          resolve();
        }
      })
    });

    let diskon = 0;
    if(params.akun_diskon){
      diskon = params.diskon;
      await new Promise(function(resolve, reject) {
        modelJurnal.insertDetail(jurnalId, params.akun_diskon, 0, diskon, function(err, data){
          if(err){
            common.log("insert detail diskon "+data);
            connection.rollback(function(){
              common.log("rollback");
            });
            res.redirect('/transaksi/pembelian?dmy1='+params.tanggal+'&errmsg='+data);
            return;
          }else{
            resolve();
          }
        })
      });
    }
    nominal = parseInt(nominal) - parseInt(diskon);
    //common.log("nominal after diskon "+nominal);

    //jurnal detail kredit
    await new Promise(function(resolve, reject) {
      //common.log(params.akun_kredit);
      //common.log(jurnalId);
      modelJurnal.insertDetail(jurnalId, params.akun_kredit, 0, nominal, function(err, data){
        if(err){
          common.log("insert detail kredit "+data);
          connection.rollback(function(){
            common.log("rollback");
          });
          res.redirect('/transaksi/pembelian?dmy1='+params.tanggal+'&errmsg='+data);
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
          res.redirect('/transaksi/pembelian?dmy1='+params.tanggal+'&errmsg='+data);
          return;
        }else{
          resolve();
        }
      });
    });

    //insert pembelian
    let beliId = null;
    await new Promise(function(resolve, reject) {
      modelPembelian.insertBeli(params, req.session.users.admin_id, jurnalId, function(err,data){
        if(err){
          common.log("insert beli "+data);
          connection.rollback(function(){
            common.log("rollback");
          });
          res.redirect('/transaksi/pembelian?dmy1='+params.tanggal+'&errmsg='+data);
          return;
        }else{
          beliId = data;
          resolve();
        }
      })
    });
    common.log("beli ID "+beliId);

    if(beliId){
      //data member
      let dataSuplier = [];
      await new Promise(function(resolve, reject) {
        modelPembelian.dataSuplierByID(params.suplier, function(err, data){
          if(err){
            common.log("query data member "+data);
            connection.rollback(function(){
              common.log("rollback");
            });
            res.redirect('/transaksi/pembelian?dmy1='+params.tanggal+'&errmsg='+data);
            return;
          }else{
            dataSuplier = data;
            resolve();
          }
        });
      });
      common.log("data suplier "+dataSuplier[0].sup_id);

      //insert mutasi suplier
      let nominal = params.nominal;
      nominal = nominal.replace(/,/g,"");
      common.log("nominal pembelian "+nominal);
      common.log("saldo suplier "+dataSuplier[0].saldo);
      let jumlah = parseInt(dataSuplier[0].saldo) + parseInt(nominal);
      common.log("jumlah akhir  "+jumlah);
      let jumlah_hutang = parseInt(dataSuplier[0].saldo_hutang);
      common.log("jumlah hutang awal "+jumlah_hutang);
      if(params.tipe_pembelian == 'hutang'){
        jumlah_hutang += parseInt(nominal);
        common.log("jumlah hutang akhir "+jumlah_hutang);
        await new Promise(function(resolve, reject) {
          modelPembelian.mutasiHutangSuplier(dataSuplier[0].sup_id, beliId, nominal, jumlah_hutang, function(err, data){
            if(err){
              connection.rollback(function(){
                common.log("rollback "+data);
              });
              res.redirect('/transaksi/pembelian?dmy1='+params.tanggal+'&errmsg='+data);
              return;
            }else{
              resolve();
            }
          });
        });
      }

      await new Promise(function(resolve, reject) {
        modelPembelian.mutasiSuplier(dataSuplier[0].sup_id, beliId, nominal, jumlah, function(err, data){
          if(err){
            connection.rollback(function(){
              common.log("rollback "+data);
            });
            res.redirect('/transaksi/pembelian?dmy1='+params.tanggal+'&errmsg='+data);
            return;
          }else{
            resolve();
          }
        });
      });

      //update saldo suplier
      await new Promise(function(resolve, reject) {
        modelPembelian.updateSaldo(dataSuplier[0].sup_id, jumlah, jumlah_hutang, function(err, data){
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

  res.redirect('/transaksi/pembelian?dmy1='+params.tanggal);
};

exports.dataSuplier = async function (req, res, next) {
  // body...
  await new Promise(function(resolve, reject) {
    modelPembelian.dataSuplier(function(err, data){
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
    modelPembelian.dataFaktur(req, function(err, data){
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

exports.akun = async function (req, res, next) {
  // body...
  await new Promise(function(resolve, reject) {
    modelPembelian.akunSelect(function(err, data){
      if(!err){
        res.json({status: 'success', message: data});
        return;
      }
    })
  });
};

exports.dataSuplierByID = async function (req, res, next) {
  // body...
  await new Promise(function(resolve, reject) {
    modelPembelian.dataSuplierByID(req.params.suplierID, function(err, data){
      if(!err){
        res.json({status: 'success', message: data});
        return;
      }
    })
  });
};
