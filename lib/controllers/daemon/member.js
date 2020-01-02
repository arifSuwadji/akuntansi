"use strict";

const common = require("../../common");

const modelMember = require("../../models/daemon/member");

exports.index = async function () {
  // body...
  let existMember = [];
  await new Promise(function(resolve, reject) {
    modelMember.dataMember(function(err, data){
      if(err){
        common.log(data);
        resolve();
      }else{
        existMember = data;
        resolve();
      }
    });
  });

  let komodo_id = 0;
  if(existMember.length > 0){
    komodo_id = existMember[0].komodo_id;
  }
  common.log("komodo member id "+komodo_id);

  let newMember = [];
  await new Promise(function(resolve, reject) {
    modelMember.dataMemberKomodo(komodo_id, function(err, data){
      if(err){
        common.log(data);
        resolve();
      }else{
        newMember = data;
        resolve();
      }
    })
  });

  if(newMember.length > 0){
    for(let i=0; i < newMember.length; i++){
      await new Promise(function(resolve, reject) {
        common.log("new member "+JSON.stringify(newMember[i]));
        modelMember.insertNewMember(newMember[i], function(err, data){
          if(err){
            common.log(data);
            resolve();
          }else{
            resolve()
          }
        });
      });
    }
  }
};
