'use strict'

const connection = require('../../db');
const common = require('../../common');

function pad_with_zeroes(number, length) {
    var my_string = '' + number;
    while (my_string.length < length) {
        my_string = '0' + my_string;
    }
    return my_string;
}

let genFaktur = function(kode, dmy1, callback){
  let tanggal = dmy1.split("-").join("");
  let nomor = kode + tanggal;
  let sql = "SELECT * FROM nomor_faktur WHERE nomor=?";
  connection.query(sql, [nomor], function(err, rows, fields){
    if(err){
      common.log("select "+err);
      return callback("err","error");
    }else{
      let jumlah = 1;
      let faktur = nomor + pad_with_zeroes(jumlah,7);
      if(!rows[0]){
        sql = "INSERT INTO nomor_faktur (nomor, jumlah) value(?, ?)";
        connection.query(sql, [nomor, jumlah], function(err, rowsI, fieds){
          if(err){
            common.log("insert nomor faktur "+err);
            throw err;
          }
        });
        return callback(null, faktur);
      }else{
        for(var i=0; i < rows.length; i++){
          jumlah = rows[i].jumlah + 1;
          faktur = nomor + pad_with_zeroes(jumlah, 7);
          sql = "UPDATE nomor_faktur set jumlah=? WHERE faktur_id=?";
          connection.query(sql, [jumlah, rows[0].faktur_id], function(err, rowsU, fields){
            if(err){
              common.og("update nomor faktur "+err);
              throw err;
            }
          });
        }
        return callback(null, faktur);
      }
    }
  });
}

let nomorFaktur = [];
let dataFaktur = function(req, res, next){
  let kode = req.params.kode;
  let dmy1 = req.query.dmy1;
  let tanggal = dmy1.split("-").join("");
  let nomor = kode + tanggal;
  let sql = "SELECT * FROM nomor_faktur WHERE nomor=?";
  connection.query(sql, [nomor], function(err, rows, fields){
    if(err){
      common.log("select "+err);
    }else{
      nomorFaktur.splice(0, nomorFaktur.length);
      let jumlah = 1;
      let faktur = nomor + pad_with_zeroes(jumlah,7);
      for(var i=0; i < rows.length; i++){
        jumlah = rows[i].jumlah + 1;
        faktur = nomor + pad_with_zeroes(jumlah, 7);
      }
      nomorFaktur.push({nf : faktur});
      next();
    }
  });
};

exports.noFaktur = nomorFaktur;
exports.dataFaktur = dataFaktur;
exports.genFaktur = genFaktur;
