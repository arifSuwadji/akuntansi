"use strict";

const common = require("../../../common");
const connection = require("../../../db");
const modelCetakKas = require("../../../models/cetak/print");

exports.index = async function (req, res, next) {
  // body...
  let recordsTotal = 0;
  let recordsFiltered = 0;
  await new Promise(function(resolve, reject) {
    modelCetakKas.count(req, function(err, data){
      if(err){
        callback('failed', data);
        resolve();
      }else{
        recordsTotal = data;
        recordsFiltered = data;
        resolve();
      }
    });
  });

  let listResponse = [];
  await new Promise(function(resolve, reject) {
    modelCetakKas.list(req, function(err,data){
      if(err){
        common.log(data);
        resolve();
      }else{
        listResponse = data;
        resolve();
      }
    });
  });

  let draw = parseInt(req.query.draw);
  let response = {
    "draw" :draw,
    "recordsTotal": recordsTotal,
    "recordsFiltered": recordsFiltered,
    "data": listResponse
  };
  res.json(response);
};
