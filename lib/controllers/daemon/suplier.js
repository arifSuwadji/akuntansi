"use strict";

const axios = require("axios");
const moment = require('moment');

const common = require("../../common");
const config = require("../../config");
const connection = require('../../db');

const modelSuplier = require("../../models/daemon/suplier");
const modelFaktur = require('../../models/transaksi/nomor_faktur');
const modelJurnal = require('../../models/transaksi/jurnalTransaksi');
const modelBB = require('../../models/transaksi/bukubesar');

exports.index = async function () {
  // body...
  let results = null;
  await axios.get(config.daemon.urlKomodo+'services/suppliers').then((response) =>{
    common.log("get data suplier");
    //common.log(" datasupplier "+response.data);
    results = response.data.results;
    //common.log("results "+JSON.stringify(results));
  }).catch(function(error){
    common.log("data supplier "+error.message);
  });

  //process results
  await Object.keys(results).forEach(function(key) {
    var val = results[key];
    modelSuplier.byNamaHandler(key, val.handler, function(err, data){
        if(!err){
          modelSuplier.insertNewSuplier(key, val.handler, function(err, data){
            if(err){
              common.log("error "+data);
            }else{
              common.log('supplier '+key+' handler '+val.handler);
            }
          });
        }
    });
  });

};

exports.mutasi = async function () {
  // body...
  let dataMutasiKomodo = []
  await new Promise(function(resolve, reject) {
    let dt = new Date();
    modelSuplier.mutasiKomodo(moment(dt).format('YYYY-MM-DD'), function(err, data){
      common.log("get data mutasi suplier "+moment(dt).format('YYYY-MM-DD')+' - 1 hari');
      if(err){
        common.log(data);
        return;
      }else{
        dataMutasiKomodo = data;
        resolve();
      }
    });
  });

  if(dataMutasiKomodo.length > 0){
    for(let i=0; i < dataMutasiKomodo.length; i++){
      await new Promise(function(resolve, reject) {
        modelSuplier.checkDataMutasi(dataMutasiKomodo[i].id, function(err,data){
          if(err){
            common.log(dataMutasiKomodo[i].handler+': ' +data);
            resolve();
          }else{
            common.log("new mutasi saldo akhir suplier "+dataMutasiKomodo[i].handler);
            modelSuplier.insertNewMutasi(dataMutasiKomodo[i], function(err, data){
              if(err){
                common.log(data);
                resolve();
              }else{
                resolve();
              }
            })
          }
        });
      });
    }
  }
};

exports.jurnalMutasi = async function () {
  // body...
  let saldoSuplier = [];
  await new Promise(function(resolve, reject) {
    common.log("jurnal mutasi suplier");
    modelSuplier.saldoSuplier(function(err, data){
      if(err){
        common.log(data);
        return;
      }else{
        saldoSuplier = data;
        resolve();
      }
    });
  });

  if(saldoSuplier.length > 0){
    let penjualan = [];
    await new Promise(function(resolve, reject) {
      modelSuplier.byProfits(saldoSuplier[0].tanggalFilter, function(err,data){
        if(!err){
          penjualan = data;
          resolve();
        }
      });
    });

    //common.log(JSON.stringify(penjualan));
    if(penjualan.length > 0 && penjualan[0].total_sales > 0){
      //begin transaction
      await new Promise(function(resolve, reject) {
        connection.beginTransaction(async function(err){
          if(err){
            common.log("begin "+err.message);
            return;
          }else{
            resolve();
          }
        });
      });

      //get faktur
      let faktur = null;
      await new Promise(function(resolve, reject) {
        let tglFaktur = saldoSuplier[0].tanggalFilter;
        common.log("tanggal faktur "+tglFaktur);
        modelFaktur.genFaktur('PJ', tglFaktur, function(err, data){
          if(err){
            common.log("gen faktur "+err+" data "+data);
            connection.rollback(function(){
              common.log("rollback ");
            });
            return;
          }else{
            faktur = data;
            resolve();
          }
        });
      });
      common.log("faktur "+faktur);

      //insert jurnal
      let jurnalId = null;
      await new Promise(function(resolve, reject) {
        modelJurnal.insert(saldoSuplier[0].tanggalFilter, 'Penjualan tanggal '+saldoSuplier[0].tanggalFilter, '', faktur, 1, function(err, data){
          if(err){
            common.log("insert jurnal "+err+" data "+data);
            connection.rollback(function(){
              common.log("rollback");
            });
            return;
          }else{
            jurnalId = data;
            resolve();
          }
        });
      });

      if(jurnalId){
        //jurnal detail debit
        await new Promise(function(resolve, reject) {
          modelJurnal.insertDetail(jurnalId, config.penjualan.akun_debit, penjualan[0].total_sales, 0, function(err, data){
            if(err){
              common.log("insert detail "+data);
              connection.rollback(function(){
                common.log("rollback");
              });
              return;
            }else{
              resolve();
            }
          })
        });
        //jurnal detail kredit
        await new Promise(function(resolve, reject) {
          modelJurnal.insertDetail(jurnalId, config.penjualan.akun_kredit, 0, penjualan[0].total_sales, function(err, data){
            if(err){
              common.log("insert detail "+data);
              connection.rollback(function(){
                common.log("rollback");
              });
              return;
            }else{
              resolve();
            }
          })
        });

        for(let i=0; i < saldoSuplier.length; i++){
          //data suplier
          let suplier = [];
          await new Promise(function(resolve, reject) {
            //common.log("get data suplier");
            common.log(saldoSuplier[i].komodo_handler);
            modelSuplier.byHandler(saldoSuplier[i].komodo_handler, function(err, data){
              //common.log("query suplier apanya")
              if(err){
                common.log(data);
                connection.rollback(function(){
                  common.log("rollback");
                });
                return;
              }else{
                suplier = data;
                resolve();
              }
            });

          });
          //common.log("json suplier "+JSON.stringify(suplier));

          //data pembelian per hari
          let total_pembelian = 0;
          await new Promise(function(resolve, reject) {
            modelSuplier.dataPembelian(suplier[0].sup_id, saldoSuplier[i].tanggalFilter, function(err, data){
              if(err){
                common.log(data);
                resolve();
              }else{
                total_pembelian = data;
                resolve();
              }
            })
          });

          //insert mutasi suplier
          let hpp = 0;
          await new Promise(function(resolve, reject) {
            modelSuplier.insertMutasiSuplier(saldoSuplier[i], suplier[0], total_pembelian, function(err, data){
              if(err){
                common.log(data);
                connection.rollback(function(){
                  common.log("rollback");
                });
              }else{
                hpp = data;
                resolve();
              }
            });
          });

          //jurnal detail debit
          await new Promise(function(resolve, reject) {
            modelJurnal.insertDetail(jurnalId, config.penjualan.akun_hpp, hpp, 0, function(err, data){
              if(err){
                common.log("insert detail "+data);
                connection.rollback(function(){
                  common.log("rollback");
                });
                return;
              }else{
                resolve();
              }
            })
          });

          //jurnal detail kredit
          await new Promise(function(resolve, reject) {
            modelJurnal.insertDetail(jurnalId, suplier[0].akun_persediaan, 0, hpp, function(err, data){
              if(err){
                common.log("insert detail "+data);
                connection.rollback(function(){
                  common.log("rollback");
                });
                return;
              }else{
                resolve();
              }
            })
          });

          //update saldo suplier
          await new Promise(function(resolve, reject) {
            common.log("saldo baru suplier "+JSON.stringify(saldoSuplier[i]));
            modelSuplier.updateSaldobyID(suplier[0].sup_id, saldoSuplier[i].nominal, function(err, data){
              if(err){
                connection.rollback(function(){
                  common.log("rollback");
                });
              }else{
                resolve();
              }
            });
          });

          //update saldo suplier set jurnal id
          await new Promise(function(resolve, reject) {
            common.log('set jurnal untuk saldo id '+saldoSuplier[i].saldo_id);
            modelSuplier.updateJurnalSaldoSuplier(jurnalId, saldoSuplier[i].saldo_id, function(err, data){
              if(err){
                connection.rollback(function(){
                  common.log("rollback");
                });
              }else{
                resolve();
              }
            });
          });
        }

        // insertBB after looping
        await new Promise(function(resolve, reject) {
          let tanggal = ""+saldoSuplier[0].tanggalFilter;
          modelBB.insertBB(jurnalId, tanggal, function(err, data){
            if(err){
              common.log("insert bb "+data);
              connection.rollback(function(){
                common.log("rollback");
              });
              return;
            }else{
              resolve();
            }
          });
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
    }

  }
};
