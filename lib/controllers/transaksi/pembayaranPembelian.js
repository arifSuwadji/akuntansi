"use strict";

const common = require("../../common");
const connection = require("../../db");

const modelPembayaran = require("../../models/transaksi/pembayaranPembelian");
const modelFaktur = require('../../models/transaksi/nomor_faktur');
const modelJurnal = require('../../models/transaksi/jurnalTransaksi');
const modelBB = require('../../models/transaksi/bukubesar');

exports.index = function (req, res, next) {
  // body...
  let urlP = req.originalUrl.split(/\?/);
  let data = {
    sessionUsers : req.session.users,
    title : 'Pembayaran Hutang VME',
    filejs : '/komodojs/transaksi/pembayaranPembelian.js',
    dmy1: req.query.dmy1,
    dmy2: req.query.dmy1,
    urlPost: urlP[0],
  }
  res.render('transaksi/pembayaranPembelian.html', data);
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
        res.redirect('/transaksi/pembayaran_hutang_suplier?dmy1='+params.tanggal+'&errmsg='+err.message);
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
    common.log("tanggal pembayaran hutang "+tanggal);
    //let tglFaktur = tanggal.getFullYear()+'-'+common.pad_with_zeroes((tanggal.getMonth()+1),2)+'-'+tanggal.getDate();
    let tglFaktur = params.tanggal;
    common.log("tanggal faktur "+tglFaktur);
    modelFaktur.genFaktur('PPH', tglFaktur, function(err, data){
      if(err){
        common.log("gen faktur "+err+" data "+data);
        connection.rollback(function(){
          common.log("rollback ");
        });
        res.redirect('/transaksi/pembayaran_hutang_suplier?dmy1='+params.tanggal+'&errmsg='+data);
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
        res.redirect('/transaksi/pembayaran_hutang_suplier?dmy1='+params.tanggal+'&errmsg='+data);
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
          res.redirect('/transaksi/pembayaran_hutang_suplier?dmy1='+params.tanggal+'&errmsg='+data);
          return;
        }else{
          resolve();
        }
      })
    });

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
          res.redirect('/transaksi/pembayaran_hutang_suplier?dmy1='+params.tanggal+'&errmsg='+data);
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
          res.redirect('/transaksi/pembayaran_hutang_suplier?dmy1='+params.tanggal+'&errmsg='+data);
          return;
        }else{
          resolve();
        }
      });
    });

    //insert bayar pembelian hutang
    let bayarId = null;
    await new Promise(function(resolve, reject) {
      modelPembayaran.insertBayar(params, req.session.users.admin_id, jurnalId, function(err,data){
        if(err){
          common.log("insert bayar "+data);
          connection.rollback(function(){
            common.log("rollback");
          });
          res.redirect('/transaksi/pembayaran_hutang_suplier?dmy1='+params.tanggal+'&errmsg='+data);
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
      let dataSuplier = [];
      await new Promise(function(resolve, reject) {
        modelPembayaran.dataSuplierByID(params.suplier, function(err, data){
          if(err){
            common.log("query data member "+data);
            connection.rollback(function(){
              common.log("rollback");
            });
            res.redirect('/transaksi/pembayaran_hutang_suplier?dmy1='+params.tanggal+'&errmsg='+data);
            return;
          }else{
            dataSuplier = data;
            resolve();
          }
        });
      });
      common.log("data suplier "+dataSuplier[0].sup_id);

      //insert mutasi hutang suplier
      let nominal = params.nominal;
      nominal = nominal.replace(/,/g,"");
      common.log("nominal pembayaran pembelian "+nominal);
      let jumlah_hutang = parseInt(dataSuplier[0].saldo_hutang);
      common.log("jumlah hutang awal "+jumlah_hutang);
      jumlah_hutang -= parseInt(nominal);
      common.log("jumlah hutang akhir "+jumlah_hutang);
      await new Promise(function(resolve, reject) {
        modelPembayaran.mutasiHutangSuplier(dataSuplier[0].sup_id, bayarId, params.pembelian_id, nominal, jumlah_hutang, function(err, data){
          if(err){
            connection.rollback(function(){
              common.log("rollback "+data);
            });
            res.redirect('/transaksi/pembayaran_hutang_suplier?dmy1='+params.tanggal+'&errmsg='+data);
            return;
          }else{
            resolve();
          }
        });
      });

      //update saldo pembelian hutang
      //sampe sini
      /*
      {
"faktur":"PPH201908060000001",
"suplier":"8",
"saldo_hutang":"5,000,000",
"akun_debit":"43",
"akun_kredit":"31",
"saldo_hutang_pembelian":"2,000,000",
"nominal":"200,000",
"sisa":"1,800,000",
"keterangan":"bayar cicilan 1",
"tableData_length":"10",
"idPembayaran":"on",
"tanggal":"2019-08-06",
"op":"submit",
"pembelian_id":"3"}
      */
      let dataPembelianById = [];
      await new Promise(function(resolve, reject) {
        modelPembayaran.listDataPembelianById(params.pembelian_id, function(err, data){
          if(err){
            connection.rollback(function(){
              common.log("rollback "+data);
            });
            res.redirect('/transaksi/pembayaran_hutang_suplier?dmy1='+params.tanggal+'&errmsg='+data);
            return;
          }else{
            dataPembelianById = data;
            resolve();
          }
        });
      });

      await new Promise(function(resolve, reject) {
        let saldoHutangPembelian = dataPembelianById[0].sisa_pembayaran;
        let sisa_pembayaran = parseInt(saldoHutangPembelian) - parseInt(nominal);
        modelPembayaran.updateSaldoHutangPembelian(dataPembelianById[0].pembelian_id, sisa_pembayaran, function(err, data){
          if(err){
            connection.rollback(function(){
              common.log("rollback "+data);
            });
            res.redirect('/transaksi/pembayaran_hutang_suplier?dmy1='+params.tanggal+'&errmsg='+data);
            return;
          }else{
            resolve();
          }
        })
      });

      //update saldo suplier
      await new Promise(function(resolve, reject) {
        modelPembayaran.updateSaldoHutang(dataSuplier[0].sup_id, jumlah_hutang, function(err, data){
          if(err){
            connection.rollback(function(){
              common.log("rollback "+data);
            });
            res.redirect('/transaksi/pembayaran_hutang_suplier?dmy1='+params.tanggal+'&errmsg='+data);
            return;
          }else{
            resolve();
          }
        })
      });
    }
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

  res.redirect('/transaksi/pembayaran_hutang_suplier?dmy1='+params.tanggal);
};

exports.dataSuplier = async function (req, res, next) {
  // body...
  await new Promise(function(resolve, reject) {
    modelPembayaran.dataSuplier(function(err, data){
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

exports.dataSuplierByID = async function (req, res, next) {
  // body...
  await new Promise(function(resolve, reject) {
    modelPembayaran.dataSuplierByID(req.params.suplierID, function(err, data){
      if(!err){
        res.json({status: 'success', message: data});
        return;
      }
    })
  });
};

exports.dataPembelianBySuplier = async function (req, res, next) {
  // body...
  let recordsTotal = 0;
  let recordsFiltered = 0;
  await new Promise(function(resolve, reject) {
    modelPembayaran.countPembelian(req, function(err, data){
      if(err){
        common.log(data);
        resolve();
      }else{
        recordsTotal = data;
        recordsFiltered = data;
        resolve();
      }
    })
  });

  let listPembelian = [];
  await new Promise(function(resolve, reject) {
    modelPembayaran.listPembelian(req, function(err, data){
      if(err){
        common.log(data);
        resolve();
      }else{
        listPembelian = data;
        resolve();
      }
    })
  });

  let draw = parseInt(req.query.draw);
  let response = {
    "draw" :draw,
    "recordsTotal": recordsTotal,
    "recordsFiltered": recordsFiltered,
    "data": listPembelian
  };
  res.json(response);
};
