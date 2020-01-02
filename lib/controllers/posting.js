"use strict"

const connection = require('../db');
const common = require('../common');

const modelJurnal = require('../models/transaksi/jurnal');

let jurnalBukubesar = function(req, res, next){
  let tgl = req.query.tanggal.split("-").reverse().join("-");;
  modelJurnal.dataJurnal(tgl, function(err, data){
    for(var i=0; i < data.length; i++){
      let lastJurnalId = data[i].jurnal_id;
      let sql = "INSERT INTO buku_besar (jurnal) value(?)";
      connection.query(sql, [lastJurnalId],function(errI, rowsI, fieldsI){
        if(errI){
          common.log("insert bukubesar "+errI);
          res.json({
            status: 'Failed',
            message: errI
          });
          return;
        }else{
          modelJurnal.detailJurnal(lastJurnalId, function(errs, resp){
            for(var j=0; j < resp.length; j++){
              sql = "INSERT INTO buku_besar_detail value(?, ?, ?, ?, ?)";
              connection.query(sql, [rowsI.insertId, tgl, resp[j].akun_perkiraan, resp[j].debit, resp[j].kredit], function(errD, rowsD, fieldsD){
                if(errD){
                  common.log("insert buku besar detail "+errD);
                  res.json({
                    status: 'Failed',
                    message: errD
                  });
                  return;
                }
              })
            }
          });
        }
      });
    }
    next();
  });
};

exports.jurnal = jurnalBukubesar;
