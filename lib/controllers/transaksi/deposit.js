"use strict";

const common = require("../../common");
const modelDeposit = require("../../models/transaksi/deposit");
const connection = require("../../db");

const modelFaktur = require('../../models/transaksi/nomor_faktur');
const modelJurnal = require('../../models/transaksi/jurnalTransaksi');
const modelBB = require('../../models/transaksi/bukubesar');

exports.index = function (req, res, next) {
  let urlP = req.originalUrl.split(/\?/);
  let urlJ = '/transaksi/kasJson/'+req.params.kode;
  let urlD = '/transaksi/deleteTmp/'+req.params.kode;
  let data = {
    sessionUsers : req.session.users,
    title : 'Deposit',
    titleKas : 'Data Deposit',
    filejs : '/komodojs/transaksi/deposit.js',
    dmy1: req.query.dmy1,
    dmy2: req.query.dmy1,
  }
  res.render('transaksi/deposit.html', data);
};

exports.data = async function (req, res, next) {
  // body...
  let recordsTotal = 0;
  let recordsFiltered = 0;
  await new Promise(function(resolve, reject) {
    modelDeposit.count(req, function(err, data){
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

  let listDeposit = [];
  await new Promise(function(resolve, reject) {
    modelDeposit.list(req, function(err, data){
      if(err){
        common.log(data);
        resolve();
      }else{
        listDeposit = data;
        resolve();
      }
    })
  });

  let draw = parseInt(req.query.draw);
  let response = {
    "draw" :draw,
    "recordsTotal": recordsTotal,
    "recordsFiltered": recordsFiltered,
    "data": listDeposit
  };
  res.json(response);
};

exports.dataById = async function (req, res, next) {
  // body...
  let recordsTotal = 0;
  let recordsFiltered = 0;
  await new Promise(function(resolve, reject) {
    modelDeposit.countById(req, function(err, data){
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

  let listDeposit = [];
  await new Promise(function(resolve, reject) {
    modelDeposit.listById(req, function(err, data){
      if(err){
        common.log(data);
        resolve();
      }else{
        listDeposit = data;
        resolve();
      }
    })
  });

  let draw = parseInt(req.query.draw);
  let response = {
    "draw" :draw,
    "recordsTotal": recordsTotal,
    "recordsFiltered": recordsFiltered,
    "data": listDeposit
  };
  res.json(response);
};

exports.update = async function (req, res, next) {
  // body...
  let deposit_id = req.body.deposit_id;
  let deposit_tipe_id = req.body.tipe_deposit;
  console.log("deposit id "+deposit_id);
  console.log("deposit tipe id "+deposit_tipe_id);
  //get data
  let dataDeposit = [];
  await new Promise(function(resolve, reject) {
    modelDeposit.data(deposit_id, function(err, data){
      if(err){
        res.json({status: 'failed', message:data});
        return;
      }else{
        dataDeposit = data;
        resolve();
      }
    })
  });

  //get tipe deposit
  let tipeDataDeposit = [];
  await new Promise(function(resolve, reject) {
    modelDeposit.tipe(deposit_tipe_id, function(err, data){
      if(err){
        res.json({status: 'failed', message: data});
        return;
      }else{
        tipeDataDeposit = data;
        resolve();
      }
    })
  });

  await new Promise(function(resolve, reject) {
    connection.beginTransaction(async function(err){
      if(err){
        common.log("begin "+err.message);
        res.json({status: 'failed', message: 'begin failed' });
        return;
      }else{
        resolve();
      }
    });
  });

  //get faktur
  let faktur = null;
  await new Promise(function(resolve, reject) {
    let tanggal = dataDeposit[0].tanggal;
    common.log("tanggal deposit "+tanggal);
    let tglFaktur = tanggal.getFullYear()+'-'+common.pad_with_zeroes((tanggal.getMonth()+1),2)+'-'+tanggal.getDate();
    common.log("tanggal faktur "+tglFaktur);
    modelFaktur.genFaktur('DP', tglFaktur, function(err, data){
      if(err){
        common.log("gen faktur "+err+" data "+data);
        connection.rollback(function(){
          common.log("rollback ");
        });
        res.json({status: 'failed', message: data});
        return;
      }else{
        faktur = data;
        resolve();
      }
    });
  });

  //insert jurnal
  let jurnalId = null;
  await new Promise(function(resolve, reject) {
    modelJurnal.insert(dataDeposit[0].tanggal, dataDeposit[0].keterangan, dataDeposit[0].catatan, faktur, req.session.users.admin_id, function(err, data){
      if(err){
        common.log("insert jurnal "+err+" data "+data);
        connection.rollback(function(){
          common.log("rollback");
        });
        res.json({status: 'failed', message: data});
        return;
      }else{
        jurnalId = data;
        resolve();
      }
    })
  });

  if(jurnalId){
    //jurnal detail debit
    await new Promise(function(resolve, reject) {
      if(dataDeposit[0].nominal < 0){
        modelJurnal.insertDetail(jurnalId, tipeDataDeposit[0].debit_akun_id, 0, -dataDeposit[0].nominal, function(err, data){
          if(err){
            common.log("insert detail "+data);
            connection.rollback(function(){
              common.log("rollback");
            });
            res.json({status: 'failed', message: data});
            return;
          }else{
            resolve();
          }
        })
      }else{
        modelJurnal.insertDetail(jurnalId, tipeDataDeposit[0].debit_akun_id, dataDeposit[0].nominal, 0, function(err, data){
          if(err){
            common.log("insert detail "+data);
            connection.rollback(function(){
              common.log("rollback");
            });
            res.json({status: 'failed', message: data});
            return;
          }else{
            resolve();
          }
        })
      }
    });

    //jurnal detail kredit
    await new Promise(function(resolve, reject) {
      if(dataDeposit[0].nominal < 0){
        modelJurnal.insertDetail(jurnalId, tipeDataDeposit[0].kredit_akun_id, -dataDeposit[0].nominal, 0, function(err, data){
          if(err){
            common.log("insert detail "+data);
            connection.rollback(function(){
              common.log("rollback");
            });
            res.json({status: 'failed', message: data});
            return;
          }else{
            resolve();
          }
        })
      }else{
        modelJurnal.insertDetail(jurnalId, tipeDataDeposit[0].kredit_akun_id, 0, dataDeposit[0].nominal, function(err, data){
          if(err){
            common.log("insert detail "+data);
            connection.rollback(function(){
              common.log("rollback");
            });
            res.json({status: 'failed', message: data});
            return;
          }else{
            resolve();
          }
        })
      }
    });

    await new Promise(function(resolve, reject) {
      let tanggal = dataDeposit[0].tanggal;
      common.log("tanggal deposit "+tanggal);
      let tglBB = tanggal.getFullYear()+'-'+common.pad_with_zeroes((tanggal.getMonth()+1),2)+'-'+tanggal.getDate();
      common.log("tanggal BB "+tglBB);
      modelBB.insertBB(jurnalId, tglBB, function(err, data){
        if(err){
          common.log("insert bb "+data);
          connection.rollback(function(){
            common.log("rollback");
          });
          res.json({status: 'failed', message: data});
          return;
        }else{
          resolve();
        }
      });
    });

    //deposit hutang
    if(deposit_tipe_id == 1){
      //data member
      let dataMember = [];
      await new Promise(function(resolve, reject) {
        modelDeposit.dataMemberByKomodoId(dataDeposit[0].member_komodo_id, function(err, data){
          if(err){
            common.log("query data member "+data);
            connection.rollback(function(){
              common.log("rollback");
            });
            res.json({status: 'failed', message: data});
            return;
          }else{
            dataMember = data;
            resolve();
          }
        });
      });

      //insert Mutasi
      let nominal = dataDeposit[0].nominal;
      let jumlah = dataMember[0].saldo_hutang + nominal;
      common.log("nominal hutang "+nominal);
      common.log("saldo hutang "+dataMember[0].saldo_hutang);
      common.log("jumlah akhir  "+jumlah);
      await new Promise(function(resolve, reject) {
        modelDeposit.mutasiHutang(dataMember[0].member_id, deposit_id, nominal, jumlah, function(err, data){
          if(err){
            connection.rollback(function(){
              common.log("rollback "+data);
            });
            res.json({status: 'failed', message: data});
            return;
          }else{
            resolve();
          }
        });
      });

      //update saldo Hutang
      await new Promise(function(resolve, reject) {
        modelDeposit.updateSaldoHutang(dataMember[0].member_id, jumlah, function(err, data){
          if(err){
            connection.rollback(function(){
              common.log("rollback "+data);
            });
            res.json({ status: 'failed', message: data});
            return;
          }else{
            resolve();
          }
        })
      });
    }

    //update data
    await new Promise(function(resolve, reject) {
      modelDeposit.update(deposit_id, deposit_tipe_id, jurnalId, function(err, data){
        if(err){
          connection.rollback(function(){
            common.log("rollback "+data);
          })
          res.json({
            status: 'failed',
            message: data
          });
          return;
        }else{
          resolve();
        }
      });
    });
  }else{
    connection.rollback(function(){
      common.log("no jurnal id <=> deposit id "+deposit_id);
      common.log("rollback");
    });
    res.json({status: 'failed', message: 'jurnal id nothing'});
    return;
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

  res.json({
    status: 'success',
    message: 'data diterima'
  })
};

exports.editTipe = function (req, res, next) {
  let urlP = req.originalUrl.split(/\?/);
  let data = {
    sessionUsers : req.session.users,
    title : 'Edit Deposit',
    titleKas : 'Data Deposit',
    idDeposit: req.params.idDeposit,
    idJurnal: req.params.idJurnal,
    filejs : '/komodojs/transaksi/edit_deposit.js',
    dmy1: req.query.dmy1,
    dmy2: req.query.dmy1,
  }
  res.render('transaksi/edit_deposit.html', data);
};

exports.actionEditTipe = async function (req, res, next) {
  // body...
  let deposit_id = req.params.idDeposit;
  let jurnalId = req.params.idJurnal;
  let deposit_tipe_id = req.body.tipe_deposit;
  console.log("edit deposit id "+deposit_id);
  console.log("edit deposit jurnal id "+jurnalId);
  console.log("edit deposit tipe id "+deposit_tipe_id);
  //get data
  let dataDeposit = [];
  await new Promise(function(resolve, reject) {
    modelDeposit.data(deposit_id, function(err, data){
      if(err){
        res.json({status: 'failed', message:data});
        return;
      }else{
        dataDeposit = data;
        resolve();
      }
    })
  });

  //get tipe deposit
  let tipeDataDeposit = [];
  await new Promise(function(resolve, reject) {
    modelDeposit.tipe(deposit_tipe_id, function(err, data){
      if(err){
        res.json({status: 'failed', message: data});
        return;
      }else{
        tipeDataDeposit = data;
        resolve();
      }
    })
  });

  await new Promise(function(resolve, reject) {
    connection.beginTransaction(async function(err){
      if(err){
        common.log("begin "+err.message);
        res.json({status: 'failed', message: 'begin failed' });
        return;
      }else{
        resolve();
      }
    });
  });

  if(jurnalId){
    //delete exist jurnalID
    await new Promise(function(resolve, reject) {
      modelJurnal.deleteDetail(jurnalId, function(err, data){
        if(err){
          common.log("delete detail jurnal "+data);
          connection.rollback(function(){
            common.log("rollback");
          });
          res.json({status: 'failed', message: data});
          return;
        }else{
          resolve();
        }
      });
    });

    //jurnal detail debit
    await new Promise(function(resolve, reject) {
      if(dataDeposit[0].nominal < 0){
        modelJurnal.insertDetail(jurnalId, tipeDataDeposit[0].debit_akun_id, 0, -dataDeposit[0].nominal, function(err, data){
          if(err){
            common.log("insert detail "+data);
            connection.rollback(function(){
              common.log("rollback");
            });
            res.json({status: 'failed', message: data});
            return;
          }else{
            resolve();
          }
        })
      }else{
        modelJurnal.insertDetail(jurnalId, tipeDataDeposit[0].debit_akun_id, dataDeposit[0].nominal, 0, function(err, data){
          if(err){
            common.log("insert detail "+data);
            connection.rollback(function(){
              common.log("rollback");
            });
            res.json({status: 'failed', message: data});
            return;
          }else{
            resolve();
          }
        })
      }
    });

    //jurnal detail kredit
    await new Promise(function(resolve, reject) {
      if(dataDeposit[0].nominal < 0){
        modelJurnal.insertDetail(jurnalId, tipeDataDeposit[0].kredit_akun_id, -dataDeposit[0].nominal, 0, function(err, data){
          if(err){
            common.log("insert detail "+data);
            connection.rollback(function(){
              common.log("rollback");
            });
            res.json({status: 'failed', message: data});
            return;
          }else{
            resolve();
          }
        })
      }else{
        modelJurnal.insertDetail(jurnalId, tipeDataDeposit[0].kredit_akun_id, 0, dataDeposit[0].nominal, function(err, data){
          if(err){
            common.log("insert detail "+data);
            connection.rollback(function(){
              common.log("rollback");
            });
            res.json({status: 'failed', message: data});
            return;
          }else{
            resolve();
          }
        })
      }
    });

    //search bb id
    let bbID = null;
    await new Promise(function(resolve, reject) {
      modelBB.byId(jurnalId, function(err, data){
        if(err){
          common.log("search  bb id "+data);
          connection.rollback(function(){
            common.log("rollback");
          });
          res.json({status: 'failed', message: data});
          return;
        }else{
          bbID = data;
          resolve();
        }
      });
    });

    if(bbID){
      await new Promise(function(resolve, reject) {
        modelBB.deleteDetail(bbID, function(err, data){
          if(err){
            common.log("delete detail bb "+data);
            connection.rollback(function(){
              common.log("rollback");
            });
            res.json({status: 'failed', message: data});
            return;
          }else{
            resolve();
          }
        });
      });

      await new Promise(function(resolve, reject) {
        let tanggal = dataDeposit[0].tanggal;
        common.log("tanggal deposit "+tanggal);
        let tglBB = tanggal.getFullYear()+'-'+common.pad_with_zeroes((tanggal.getMonth()+1),2)+'-'+tanggal.getDate();
        common.log("tanggal BB "+tglBB);
        modelBB.insertDetail(jurnalId, bbID, tglBB, function(err, data){
          if(err){
            common.log("insert bb detail "+data);
            connection.rollback(function(){
              common.log("rollback");
            });
            res.json({status: 'failed', message: data});
            return;
          }else{
            resolve();
          }
        });
      });
    }

    //data member
    let dataMember = [];
    await new Promise(function(resolve, reject) {
      modelDeposit.dataMemberByKomodoId(dataDeposit[0].member_komodo_id, function(err, data){
        if(err){
          common.log("query data member "+data);
          connection.rollback(function(){
            common.log("rollback");
          });
          res.json({status: 'failed', message: data});
          return;
        }else{
          dataMember = data;
          resolve();
        }
      });
    });

    //deposit hutang
    if(deposit_tipe_id == 1){
      //insert Mutasi
      let nominal = dataDeposit[0].nominal;
      let jumlah = dataMember[0].saldo_hutang + nominal;
      common.log("nominal hutang "+nominal);
      common.log("saldo hutang "+dataMember[0].saldo_hutang);
      common.log("jumlah akhir  "+jumlah);
      await new Promise(function(resolve, reject) {
        modelDeposit.mutasiHutang(dataMember[0].member_id, deposit_id, nominal, jumlah, function(err, data){
          if(err){
            connection.rollback(function(){
              common.log("rollback "+data);
            });
            res.json({status: 'failed', message: data});
            return;
          }else{
            resolve();
          }
        });
      });

      //update saldo Hutang
      await new Promise(function(resolve, reject) {
        modelDeposit.updateSaldoHutang(dataMember[0].member_id, jumlah, function(err, data){
          if(err){
            connection.rollback(function(){
              common.log("rollback "+data);
            });
            res.json({ status: 'failed', message: data});
            return;
          }else{
            resolve();
          }
        })
      });
    }else{
      //delete Mutasi
      let nominal = dataDeposit[0].nominal;
      let jumlah = dataMember[0].saldo_hutang - nominal;
      common.log("nominal hutang "+nominal);
      common.log("saldo hutang "+dataMember[0].saldo_hutang);
      common.log("jumlah akhir  "+jumlah);
      await new Promise(function(resolve, reject) {
        modelDeposit.deleteMutasiHutang(dataMember[0].member_id, deposit_id, nominal, jumlah, function(err, data){
          if(err){
            connection.rollback(function(){
              common.log("rollback "+data);
            });
            res.json({status: 'failed', message: data});
            return;
          }else{
            resolve();
          }
        });
      });

      //update saldo Hutang
      await new Promise(function(resolve, reject) {
        if(jumlah < 0)
          jumlah = 0;
        modelDeposit.updateSaldoHutang(dataMember[0].member_id, jumlah, function(err, data){
          if(err){
            connection.rollback(function(){
              common.log("rollback "+data);
            });
            res.json({ status: 'failed', message: data});
            return;
          }else{
            resolve();
          }
        })
      });
    }

    //update data
    await new Promise(function(resolve, reject) {
      modelDeposit.update(deposit_id, deposit_tipe_id, jurnalId, function(err, data){
        if(err){
          connection.rollback(function(){
            common.log("rollback "+data);
          })
          res.json({
            status: 'failed',
            message: data
          });
          return;
        }else{
          resolve();
        }
      });
    });
  }else{
    connection.rollback(function(){
      common.log("no jurnal id <=> deposit id "+deposit_id);
      common.log("rollback");
    });
    res.json({status: 'failed', message: 'jurnal id nothing'});
    return;
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

  res.json({
    status: 'success',
    message: 'data diterima'
  })
};
