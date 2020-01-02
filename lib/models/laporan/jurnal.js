'use strict'

const connection = require('../../db');
const common = require('../../common');

const config = require('../../config');

let listKasKecil = [];
let countKasKecil = [];
let dataKasKecil = function(req, res, next){
  let akun_id = config.laporan.akun_kas_kecil;
  let start = parseInt(req.query.start);
  let value = req.query.search.value;
  let tanggal = value.split('/').reverse().join('-');
  let countSql = 'SELECT *, COUNT(*) AS countKas FROM jurnal_detail INNER JOIN jurnal on jurnal.jurnal_id = jurnal_detail.jurnal WHERE akun_perkiraan=? AND tanggal=?';
  connection.query(countSql, [akun_id, tanggal], function(err, rows, fields){
    if(err){
      common.log("count kas kecil "+err);
      throw err;
    }else{
      countKasKecil.splice(0, countKasKecil.length);
      countKasKecil.push({count: rows[0].countKas});
    }
  });

  let sql = "SELECT *,date_format(tanggal, '%d-%m-%Y') as tglView FROM jurnal_detail INNER JOIN jurnal on jurnal.jurnal_id = jurnal_detail.jurnal INNER JOIN akun_perkiraan on akun_perkiraan.akun_id = jurnal_detail.akun_perkiraan WHERE akun_perkiraan=? AND tanggal = ?";
  connection.query(sql, [akun_id, tanggal], function(err, rows, fields){
    if(err){
      common.log("select kas kecil "+err);
      throw err;
    }else{
      listKasKecil.splice(0, listKasKecil.length);
      sql = "select sum(debit) - sum(kredit) as saldoAwal from jurnal_detail INNER JOIN jurnal on jurnal.jurnal_id = jurnal_detail.jurnal WHERE akun_perkiraan=? and tanggal < ?";
      connection.query(sql, [akun_id, tanggal], function(err, rowsA, fields){
        if(err){
          common.log("count saldo awal "+err);
          throw err;
        }else{
          if(!rowsA[0].saldoAwal){
            listKasKecil.push({hitung:"",tglView:"",faktur:"",keterangan:"Saldo Awal",debit:0,kredit:0,saldo: 0, kode_akun:config.laporan.kode_kas_kecil, nama_akun:config.laporan.nama_kas_kecil});
            let last_saldo = 0;
            for(var i=0; i < rows.length; i++){
              last_saldo += rows[i].debit;
              last_saldo -= rows[i].kredit;
              start++;
              rows[i].hitung = start;
              rows[i].saldo = last_saldo;
              listKasKecil.push(rows[i]);
            }
            next();
            return;
          }else{
            listKasKecil.push({hitung:"",tglView:"",faktur:"",keterangan:"Saldo Awal ",debit:"",kredit:"",saldo:rowsA[0].saldoAwal,kode_akun:config.laporan.kode_kas_kecil, nama_akun:config.laporan.nama_kas_kecil});
            let last_saldo = rowsA[0].saldoAwal;
            for(var i=0; i < rows.length; i++){
              last_saldo += rows[i].debit;
              last_saldo -= rows[i].kredit;
              start++;
              rows[i].hitung = start;
              rows[i].saldo = last_saldo;
              listKasKecil.push(rows[i]);
            }
            next();
          }
        }
      });
    }
  });
};

let listJurnal = [];
let countJurnal = [];
let dataJurnal = function(req, res, next){
  let start = parseInt(req.query.start);
  let length = parseInt(req.query.length);
  let value = req.query.search.value;
  let arrVal = value.split(/\_/);
  let tanggal = arrVal[0].split('/').reverse().join('-');
  let keterangan = "%"+arrVal[1]+"%";
  let countSql = 'SELECT *, COUNT(*) AS countJurnal FROM jurnal LEFT JOIN jurnal_detail on jurnal_detail.jurnal = jurnal.jurnal_id INNER JOIN akun_perkiraan on akun_perkiraan.akun_id = jurnal_detail.akun_perkiraan WHERE tanggal=? AND keterangan like ?';
  connection.query(countSql, [tanggal, keterangan], function(err, rows, fields){
    if(err){
      common.log("count jurnal "+err);
      throw err;
    }else{
      countJurnal.splice(0, countJurnal.length);
      countJurnal.push({count: rows[0].countJurnal});
    }
  });

  let sql = "SELECT *, date_format(tanggal, '%d-%m-%Y') as tglView FROM jurnal LEFT JOIN jurnal_detail on jurnal_detail.jurnal = jurnal.jurnal_id INNER JOIN akun_perkiraan on akun_perkiraan.akun_id = jurnal_detail.akun_perkiraan WHERE tanggal=? AND keterangan like ? LIMIT ?,?";
  //let sql = "SELECT *, date_format(tanggal, '%d-%m-%Y') as tglView FROM jurnal";
  connection.query(sql, [tanggal, keterangan, start,length], function(err, rows, fields){
    if(err){
      common.log("select jurnal "+err);
      throw err;
    }else{
      listJurnal.splice(0, listJurnal.length);
      let last_faktur = '';
      for(var i=0; i < rows.length; i++){
        start++;
        rows[i].hitung = start;
        listJurnal.push(rows[i]);
      }
      next();
    }
  });
};

exports.kasList = listKasKecil;
exports.kasCount = countKasKecil;
exports.kasData = dataKasKecil;
exports.dataJurnal = dataJurnal;
exports.countJurnal = countJurnal;
exports.listJurnal = listJurnal;
