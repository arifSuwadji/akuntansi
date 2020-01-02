'use strict';

const common = require('../../common');

const modelSuplier = require('../../models/master/suplier');

exports.index = function (req, res, next) {
  // body...
  let data = {
    sessionUsers : req.session.users,
    title : 'Data Suplier',
    filejs : '/komodojs'+req.originalUrl+'.js',
    dmy1: common.date(),
    dmy2: common.date(),
  }
  res.render('master/suplier/listSuplier.html', data);
};

exports.data = async function (req, res, next) {
  // body...
  let recordsTotal = 0;
  let recordsFiltered = 0;
  await new Promise(function(resolve, reject) {
    modelSuplier.count(req, function(err, data){
      if(err){
        common.log(data);
        resolve();
      }else{
        recordsTotal = data;
        recordsFiltered = data;
        resolve();
      }
    });
  });

  //kode akun persediaan
  let akunPersediaan = '';
  await new Promise(function(resolve, reject) {
    modelSuplier.akunPerkiraan('1.3', function(err, data){
      if(err){
        common.log(data);
        resolve();
      }else{
        //akunPersediaan = data;
        for(let i =0; i < data.length; i++){
          akunPersediaan += '<option value="'+data[i].akun_id+'">'+data[i].kode_akun+' - '+data[i].nama_akun+'</option>';
        }
        resolve();
      }
    });
  });

  let akunHutang = [];
  await new Promise(function(resolve, reject) {
    modelSuplier.akunPerkiraan('2', function(err, data){
      if(err){
        common.log(data);
        resolve();
      }else{
        //akunHutang = data;
        for(let i =0; i < data.length; i++){
          akunHutang += '<option value="'+data[i].akun_id+'">'+data[i].kode_akun+' - '+data[i].nama_akun+'</option>';
        }
        resolve();
      }
    })
  });

  let listSuplier = [];
  await new Promise(function(resolve, reject) {
    modelSuplier.list(req, function(err, data){
      if(err){
        common.log(data);
        resolve();
      }else{
        listSuplier = data;
        resolve();
      }
    });
  });

  let listSuplierAkun = [];
  for(let i=0; i < listSuplier.length; i++){
    let namaKodeAkunPersediaan = '';
    let namaKodeAkunHutang = '';
    await new Promise(function(resolve, reject) {
      modelSuplier.akunById(listSuplier[i].akun_persediaan, function(err, data){
        if(err){
          resolve();
        }else{
          namaKodeAkunPersediaan = data[0].kode_akun+' - '+data[0].nama_akun;
          resolve();
        }
      });
    });
    await new Promise(function(resolve, reject) {
      modelSuplier.akunById(listSuplier[i].akun_hutang, function(err, data){
        if(err){
          resolve();
        }else{
          namaKodeAkunHutang = data[0].kode_akun+' - '+data[0].nama_akun;
          resolve();
        }
      });
    });
    listSuplierAkun.push({sup_id: listSuplier[i].sup_id, nama_suplier: listSuplier[i].nama_suplier, saldo_suplier: listSuplier[i].saldo, saldo_hutang: listSuplier[i].saldo_hutang, akun_persediaan: listSuplier[i].akun_persediaan, akun_hutang: listSuplier[i].akun_hutang, nama_akun_persediaan: namaKodeAkunPersediaan, nama_akun_hutang: namaKodeAkunHutang, optAkunPersediaan: akunPersediaan, optAkunHutang: akunHutang});
  }

  let draw = parseInt(req.query.draw);
  let response = {
    "draw" : draw,
    "recordsTotal": recordsTotal,
    "recordsFiltered": recordsFiltered,
    "data": listSuplierAkun
  }
  res.json(response);

};

exports.updateAkun = async function (req, res, next) {
  // body...
  let supID = req.body.sup_id;
  let akunPersediaan = req.body.akun_persediaan;
  let akunHutang = req.body.akun_hutang;
  common.log("sup id "+supID+" akun persediaan "+akunPersediaan+' akun hutang '+akunHutang);
  if(akunPersediaan){
    await new Promise(function(resolve, reject) {
      modelSuplier.updateAkunPersediaan(supID, akunPersediaan, function(err, data){
        if(!err)
          resolve();
      })
    });
  }

  if(akunHutang){
    await new Promise(function(resolve, reject) {
      modelSuplier.updateAkunHutang(supID, akunHutang, function(err, data){
        if(!err)
          resolve();
      })
    });
  }

  res.json({
    status: 'success',
    message: 'data diterima'
  });
};

exports.mutasi = function (req, res, next) {
  // body...
  let data = {
    sessionUsers : req.session.users,
    idSuplier: req.params.idSuplier,
    title : 'Mutasi Suplier '+req.params.namaSuplier,
    filejs : '/komodojs/master/suplier/mutasi.js',
    dmy1: common.date(),
    dmy2: common.date(),
  }
  res.render('master/suplier/mutasi.html', data);
};

exports.mutasiJson = async function (req, res, next) {
  // body...
  let recordsTotal = 0;
  let recordsFiltered = 0;
  //hitung saldo suplier
  await new Promise(function(resolve, reject) {
    modelSuplier.countSaldoSuplierBySuplier(req, function(err, data){
      if(err){
        common.log(data);
        resolve();
      }else{
        recordsTotal = data;
        recordsFiltered = data;
        resolve();
      }
    });
  });

  //hitung pembelian suplier
  await new Promise(function(resolve, reject) {
    modelSuplier.countPembelianBySuplier(req, function(err, data){
      if(err){
        common.log(data);
        resolve();
      }else{
        recordsTotal = recordsTotal + data;
        recordsFiltered = recordsTotal + data;
        resolve();
      }
    })
  });

  let listMutasi = [];
  let listMutasiSaldoSuplier = [];
  await new Promise(function(resolve, reject) {
    modelSuplier.listMutasiSaldoSuplier(req, function(err, data){
      if(err){
        common.log(data);
        resolve();
      }else{
        listMutasiSaldoSuplier = data;
        resolve();
      }
    });
  });

  let listMutasiPembelian = [];
  await new Promise(function(resolve, reject) {
    modelSuplier.listMutasiPembelian(req, function(err, data){
      if(err){
        common.log(data);
        resolve();
      }else{
        listMutasiPembelian = data;
        resolve();
      }
    });
  });

  let listMutasiTmp = [];
  await new Promise(function(resolve, reject) {
    if(listMutasiSaldoSuplier.length > 0){
      for(let i=0; i < listMutasiSaldoSuplier.length; i++){
        let list = listMutasiSaldoSuplier[i];
        let data = {tanggal: list.tsView, id: list.saldo_id, tipe: 'Penjualan', debit: list.nominal, kredit: 0, saldo: list.jumlah}
        listMutasiTmp.push(data);
      }
    }
    //let data = {tanggal: '2019-07-19 13:44:28', id: 14, tipe: 'penjualan', debit:0, kredit: 1000000, saldo:1085000}
    //listMutasiHutangTmp.push(data);
    if(listMutasiPembelian.length > 0){
      for(let i=0; i < listMutasiPembelian.length; i++){
        let list = listMutasiPembelian[i];
        let data = {tanggal: list.tsView, id: list.pembelian_id, tipe: 'Pembelian', debit: 0, kredit: list.nominal, saldo: list.jumlah};
        listMutasiTmp.push(data);
      }
    }

    listMutasi = listMutasiTmp.sort(dynamicSort("tanggal"));
    resolve();
  });

  let draw = parseInt(req.query.draw);
  let response = {
    "draw" :draw,
    "recordsTotal": recordsTotal,
    "recordsFiltered": recordsTotal,
    "data": listMutasi
  };
  res.json(response);
};

exports.mutasi_hutang = function (req, res, next) {
  // body...
  let data = {
    sessionUsers : req.session.users,
    idSuplier: req.params.idSuplier,
    title : 'Mutasi Hutang VME ke Suplier '+req.params.namaSuplier,
    filejs : '/komodojs/master/suplier/mutasiHutang.js',
    dmy1: common.date(),
    dmy2: common.date(),
  }
  res.render('master/suplier/mutasi_hutang.html', data);
};

exports.mutasiHutangJson = async function (req, res, next) {
  // body...
  let recordsTotal = 0;
  let recordsFiltered = 0;
  //hitung pembelian hutang by suplier
  await new Promise(function(resolve, reject) {
    modelSuplier.countPembelianHutangBySuplier(req, function(err, data){
      if(err){
        common.log(data);
        resolve();
      }else{
        recordsTotal = data;
        recordsFiltered = data;
        resolve();
      }
    });
  });

  //hitung pembayaran hutang pembelian
  await new Promise(function(resolve, reject) {
    modelSuplier.countBayarPembelianHutangBySuplier(req, function(err, data){
      if(err){
        common.log(data);
        resolve();
      }else{
        recordsTotal = recordsTotal + data;
        recordsFiltered = recordsTotal + data;
        resolve();
      }
    })
  });

  let listMutasiHutang = [];
  let pembelianHutangSuplier = [];
  await new Promise(function(resolve, reject) {
    modelSuplier.listPembelianHutangSuplier(req, function(err, data){
      if(err){
        common.log(data);
        resolve();
      }else{
        pembelianHutangSuplier = data;
        resolve();
      }
    });
  });

  let bayarPembelianHutangSuplier = [];
  await new Promise(function(resolve, reject) {
    modelSuplier.listBayarPembelianHutangSuplier(req, function(err, data){
      if(err){
        common.log(data);
        resolve();
      }else{
        bayarPembelianHutangSuplier = data;
        resolve();
      }
    });
  });

  let listMutasiHutangTmp = [];
  await new Promise(function(resolve, reject) {
    if(pembelianHutangSuplier.length > 0){
      for(let i=0; i < pembelianHutangSuplier.length; i++){
        let list = pembelianHutangSuplier[i];
        let data = {tanggal: list.tsView, id: list.pembelian_id, tipe: 'Pembelian Hutang', debit: 0, kredit: list.nominal, saldo: list.jumlah}
        listMutasiHutangTmp.push(data);
      }
    }
    //let data = {tanggal: '2019-07-19 13:44:28', id: 14, tipe: 'penjualan', debit:0, kredit: 1000000, saldo:1085000}
    //listMutasiHutangTmp.push(data);
    if(bayarPembelianHutangSuplier.length > 0){
      for(let i=0; i < bayarPembelianHutangSuplier.length; i++){
        let list = bayarPembelianHutangSuplier[i];
        let data = {tanggal: list.tsView, id: list.bayar_id, tipe: 'Bayar Pembelian Hutang', debit: -list.nominal, kredit: 0, saldo: list.jumlah};
        listMutasiHutangTmp.push(data);
      }
    }

    listMutasiHutang = listMutasiHutangTmp.sort(dynamicSort("tanggal"));
    resolve();
  });

  let draw = parseInt(req.query.draw);
  let response = {
    "draw" :draw,
    "recordsTotal": recordsTotal,
    "recordsFiltered": recordsTotal,
    "data": listMutasiHutang
  };
  res.json(response);
};

function dynamicSort(property) {
    var sortOrder = 1;

    if(property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }

    return function (a,b) {
        if(sortOrder == -1){
            return b[property].localeCompare(a[property]);
        }else{
            return a[property].localeCompare(b[property]);
        }
    }
}
