"use strict";

const common = require("../../common");
const modelDeposit = require("../../models/daemon/deposit");

exports.index = async function () {
  // body...
  let existDeposit = [];
  await new Promise(function(resolve, reject) {
    modelDeposit.dataDeposit(function(err, data){
      if(err){
        common.log(data);
        resolve();
      }else{
        existDeposit = data;
        resolve();
      }
    })
  });

  let komodo_mutasi_id = 0;
  if(existDeposit.length > 0){
    komodo_mutasi_id = existDeposit[0].komodo_mutasi_id;
  }
  common.log("komodo mutasi id "+komodo_mutasi_id);

  let newMutasiDeposit = [];
  await new Promise(function(resolve, reject) {
    modelDeposit.dataMutasiDepositKomodo(komodo_mutasi_id, function(err, data){
      if(err){
        common.log(data);
        resolve();
      }else{
        newMutasiDeposit = data;
        resolve();
      }
    });
  });

  if(newMutasiDeposit.length > 0){
    for(let i=0; i < newMutasiDeposit.length; i++){
      await new Promise(function(resolve, reject) {
        common.log("mutasi baru "+JSON.stringify(newMutasiDeposit[i]));
        modelDeposit.insertNewMutasi(newMutasiDeposit[i], function(err, data){
          if(err){
            common.log(data);
            resolve();
          }else{
            resolve();
          }
        })
      });
    }
  }
};
