'use strict'

const connection = require('../../db');
const common = require('../../common');

const config = require('../../config');

let listBukubesar = [];
let countBukubesar = [];
let dataBukubesar = function(req, res, next){
  let start = parseInt(req.query.start);
  let length = parseInt(req.query.length);
  let value = req.query.search.value;
  let dariTgl = ''; let smpTgl =''; let akun_id=''; let keterangan='';
  if(value){
    let arrVal = value.split(/\_/);
    dariTgl = arrVal[0].split('/').reverse().join('-');
    smpTgl = arrVal[1].split('/').reverse().join('-');
    akun_id = arrVal[2];
    keterangan = "%"+arrVal[3]+"%";
  }
  let countSql = 'SELECT *, COUNT(*) AS countBukubesar FROM buku_besar_detail INNER JOIN buku_besar on buku_besar.bukubesar_id = buku_besar_detail.bukubesar INNER JOIN jurnal on jurnal.jurnal_id = buku_besar.jurnal WHERE akun_perkiraan=? AND tanggal_bb >= ? AND tanggal_bb <= ? AND keterangan like ?';
  connection.query(countSql, [akun_id, dariTgl, smpTgl, keterangan], function(err, rows, fields){
    if(err){
      common.log("count BUKU BESAR "+err);
      throw err;
    }else{
      countBukubesar.splice(0, countBukubesar.length);
      countBukubesar.push({count: rows[0].countBukubesar});
    }
  });

  let sql = "SELECT *,date_format(tanggal_bb, '%d-%m-%Y') as tglView FROM buku_besar_detail INNER JOIN buku_besar on buku_besar.bukubesar_id = buku_besar_detail.bukubesar INNER JOIN jurnal on jurnal.jurnal_id = buku_besar.jurnal INNER JOIN akun_perkiraan on akun_perkiraan.akun_id = buku_besar_detail.akun_perkiraan WHERE akun_perkiraan=? AND tanggal_bb >= ? AND tanggal_bb <= ? AND keterangan like ?";
  connection.query(sql, [akun_id, dariTgl, smpTgl, keterangan], function(err, rows, fields){
    if(err){
      common.log("select bukubesar "+err);
      throw err;
    }else{
      listBukubesar.splice(0, listBukubesar.length);
      sql = "select sum(debit) - sum(kredit) as saldoAwalDebit, sum(kredit) - sum(debit) as saldoAwalKredit from buku_besar_detail WHERE akun_perkiraan=? and tanggal_bb < ?";
      connection.query(sql, [akun_id, dariTgl], function(err, rowsA, fields){
        if(err){
          common.log("count saldo awal "+err);
          throw err;
        }else{
          if(!rowsA[0].saldoAwalDebit && !rowsA[0].saldoAwalKredit){
            listBukubesar.push({hitung:"",tglView:"",faktur:"",keterangan:"Saldo Awal",debit:0,kredit:0,saldo_debit: 0, saldo_kredit:0});
            let last_saldo = 0;
            for(var i=0; i < rows.length; i++){
              start++;
              rows[i].hitung = start;
              if(rows[i].kode_akun.match('^1') || rows[i].kode_akun.match('^5')){
                last_saldo += rows[i].debit;
                last_saldo -= rows[i].kredit;
                rows[i].saldo_debit = last_saldo;
                rows[i].saldo_kredit = 0;
              }else if(rows[i].kode_akun.match('^2') || rows[i].kode_akun.match('^3') || rows[i].kode_akun.match('^4')){
                last_saldo += rows[i].kredit;
                last_saldo -= rows[i].debit;
                rows[i].saldo_debit = 0;
                rows[i].saldo_kredit = last_saldo;
              }
              listBukubesar.push(rows[i]);
            }
            next();
            return;
          }else{
            if(rowsA[0].saldoAwalDebit > 0){
              listBukubesar.push({hitung:"",tglView:"",faktur:"",keterangan:"Saldo Awal ",debit:"",kredit:"",saldo_debit:rowsA[0].saldoAwalDebit, saldo_kredit:0});
            }else if(rowsA[0].saldoAwalKredit > 0){
              listBukubesar.push({hitung:"",tglView:"",faktur:"",keterangan:"Saldo Awal ",debit:"",kredit:"",saldo_debit:0, saldo_kredit:rowsA[0].saldoAwalKredit});
            }
            let last_saldo = 0;
            start = 0;
            for(var i=0; i < rows.length; i++){
              start++;
              rows[i].hitung = start;
              if(rows[i].kode_akun.match('^1') || rows[i].kode_akun.match('^5')){
                if(start == 1){
                  last_saldo = rowsA[0].saldoAwalDebit;
                }
                last_saldo += rows[i].debit;
                last_saldo -= rows[i].kredit;
                rows[i].saldo_debit = last_saldo;
                rows[i].saldo_kredit = 0;
              }else if(rows[i].kode_akun.match('^2') || rows[i].kode_akun.match('^3') || rows[i].kode_akun.match('^4')){
                if(start == 1){
                  last_saldo = rowsA[0].saldoAwalKredit;
                }
                last_saldo += rows[i].kredit;
                last_saldo -= rows[i].debit;
                rows[i].saldo_debit = 0;
                rows[i].saldo_kredit = last_saldo;
              }
              listBukubesar.push(rows[i]);
            }
            next();
          }
        }
      });
    }
  });
};

exports.bbList = listBukubesar;
exports.bbCount = countBukubesar;
exports.bbData = dataBukubesar;
