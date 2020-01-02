"use strict";

const common = require("../../common");
const modelJurnal = require('../../models/laporan/jurnalTransaksi');

exports.byId = async function (req, res, next) {
  //modelJurnal.dataJurnal, function(req, res, next){
  let recordsTotal = 0;
  let recordsFiltered = 0;
  await new Promise(function(resolve, reject) {
    modelJurnal.countById(req, function(err, data){
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

  let listJurnal = [];
  await new Promise(function(resolve, reject) {
    modelJurnal.listById(req, function(err, data){
      if(err){
        common.log(data);
        resolve();
      }else{
        listJurnal = data;
        resolve();
      }
    })
  });

  let draw = parseInt(req.query.draw);
  let response = {
    "draw" :draw,
    "recordsTotal": recordsTotal,
    "recordsFiltered": recordsFiltered,
    "data": listJurnal
  };
  res.json(response);
}
