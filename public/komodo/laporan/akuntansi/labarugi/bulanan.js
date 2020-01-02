'use strict';

//'pageLength' : 1,
let tablePendapatan = $('#tableDataPendapatan').DataTable({
  'paging'      : true,
  'lengthChange': true,
  'searching'   : true,
  'ordering'    : false,
  'autoWidth'   : false,
  'info'        : true,
  'processing'  : true,
  'serverSide'  : true,
  'ajax' : '/laporan/akuntansi/labarugi/bulanan/pendapatanJson',
  "order": [[ 1, "asc" ]],
  'pageLength' : 100,
  "dom" : 'tr',
  'columns' : [
    { "mRender" : function(data, type, full){
      if(full['tipe_akun'] == 'induk'){
        return '<span class="text-bold">'+full['kode_akun']+'</span>';
      }else{
        return full['kode_akun'];
      }
    }},
    { "mRender" : function(data, type, full){
      if(full['tipe_akun'] == 'induk'){
        return '<span class="text-bold">'+full['nama_akun']+'</span>';
      }else{
        return full['nama_akun'];
      }
    }},
    { "mRender" : function(data, type, full){
      if(full['tipe_akun'] == 'induk'){
        return '<span class="pull-right text-bold" id="saldoAwal'+full['akun_id']+'">'+saldoAwalPendapatan(full['akun_id'], full['tipe_akun'], full['kode_akun'])+'</span>';
      }else{
        return '<span class="pull-right" id="saldoAwal'+full['akun_id']+'">'+saldoAwalPendapatan(full['akun_id'], full['tipe_akun'], full['kode_akun'])+'</span>';
      }
    }},
    { "mRender" : function(data, type, full){
      if(full['tipe_akun'] == 'induk'){
        return '<div class="col-md-3">'+' <div class="box box-primary box-solid">'+' <div class="box-header with-border">'+' <h3 class="box-title text-bold">'+full['kode_akun']+'</h3>'+'<div class="box-tools pull-right">'+' </div>'+' </div>'+' <div class="box-body"><h5 class="text-bold">'+full['nama_akun']+'</h5><h5 class="text-bold">Saldo: <span id="saldoAwal'+full['akun_id']+'"></span></h5></div>'+' </div>'+' </div>';
      }else{
        return '<div class="col-md-3">'+' <div class="box box-primary box-solid">'+' <div class="box-header with-border">'+' <h3 class="box-title">'+full['kode_akun']+'</h3>'+'<div class="box-tools pull-right">'+' </div>'+' </div>'+' <div class="box-body"><h5>'+full['nama_akun']+'</h5><h5>Saldo: <span id="saldoAwal'+full['akun_id']+'"></span></h5></div>'+' </div>'+' </div>';
      }
    }}
  ]
});

let tableBeban = $('#tableDataBeban').DataTable({
  'paging'      : true,
  'lengthChange': true,
  'searching'   : true,
  'ordering'    : false,
  'autoWidth'   : false,
  'info'        : true,
  'processing'  : true,
  'serverSide'  : true,
  'ajax' : '/laporan/akuntansi/labarugi/bulanan/bebanJson',
  "order": [[ 1, "asc" ]],
  'pageLength' : 100,
  "dom" : 'tr',
  'columns' : [
    { "mRender" : function(data, type, full){
      if(full['tipe_akun'] == 'induk'){
        return '<span class="text-bold">'+full['kode_akun']+'</span>';
      }else{
        return full['kode_akun'];
      }
    }},
    { "mRender" : function(data, type, full){
      if(full['tipe_akun'] == 'induk'){
        return '<span class="text-bold">'+full['nama_akun']+'</span>';
      }else{
        return full['nama_akun'];
      }
    }},
    { "mRender" : function(data, type, full){
      if(full['tipe_akun'] == 'induk'){
        return '<span class="pull-right text-bold" id="saldoAwal'+full['akun_id']+'">'+saldoAwalBeban(full['akun_id'], full['tipe_akun'], full['kode_akun'])+'</span>';
      }else{
        return '<span class="pull-right" id="saldoAwal'+full['akun_id']+'">'+saldoAwalBeban(full['akun_id'], full['tipe_akun'], full['kode_akun'])+'</span>';
      }
    }},
    { "mRender" : function(data, type, full){
      if(full['tipe_akun'] == 'induk'){
        return '<div class="col-md-3">'+' <div class="box box-primary box-solid">'+' <div class="box-header with-border">'+' <h3 class="box-title text-bold">'+full['kode_akun']+'</h3>'+'<div class="box-tools pull-right">'+' </div>'+' </div>'+' <div class="box-body"><h5 class="text-bold">'+full['nama_akun']+'</h5><h5 class="text-bold">Saldo: <span id="saldoAwal'+full['akun_id']+'"></span></h5></div>'+' </div>'+' </div>';
      }else{
        return '<div class="col-md-3">'+' <div class="box box-primary box-solid">'+' <div class="box-header with-border">'+' <h3 class="box-title">'+full['kode_akun']+'</h3>'+'<div class="box-tools pull-right">'+' </div>'+' </div>'+' <div class="box-body"><h5>'+full['nama_akun']+'</h5><h5>Saldo: <span id="saldoAwal'+full['akun_id']+'"></span></h5></div>'+' </div>'+' </div>';
      }
    }}
  ]
});

$("#cari").on("click", function(event){
  event.preventDefault();
  let drTgl = $("#dmy1").val();
  let smTgl = $("#dmy2").val();
  $("#totalPendapatanSaldoAwal").text(0);
  $("#totalPendapatanMutasi").text(0);
  $("#totalPendapatanSaldoAkhir").text(0);
  $("#totalBebanSaldoAwal").text(0);
  $("#totalBebanMutasi").text(0);
  $("#totalBebanSaldoAkhir").text(0);
  $("#totalAwalLR").text(0);
  $("#totalMutasiLR").text(0);
  $("#totalAkhirLR").text(0);
  tablePendapatan.search(drTgl+'_'+smTgl).draw();
  tableBeban.search(drTgl+'_'+smTgl).draw();
});

let getSaldoAwal = function (idAkun, tipeAkun, kodeAkun, callback){
  let dmy1 = $('#dmy1').val();
  $.get('/laporan/akuntansi/labarugi/bulanan/saldoAkun/'+idAkun+'/'+tipeAkun+'/'+kodeAkun, {tanggal:dmy1}, function(data, status){
    callback(null, data.saldo);
  }).fail(function(){
    callback('gagal', 0);
  });
}

let getSaldoMutasi = function(idAkun, tipeAkun, kodeAkun, callback){
  let dmy1 = $('#dmy1').val();
  let dmy2 = $('#dmy2').val();
  $.get('/laporan/akuntansi/labarugi/harian/saldoMutasiAkun/'+idAkun+'/'+tipeAkun+'/'+kodeAkun, {tanggal:dmy1, tanggal2:dmy2}, function(data, status){
    callback(null, data.saldo);
  }).fail(function(){
    callback('gagal', 0);
  });
}

let lastAkun = 0;
let saldoAwalPendapatan = function(idAkun, tipeAkun, kodeAkun){
  getSaldoAwal(idAkun, tipeAkun, kodeAkun, function(err, saldo){
    if(saldo){
      $('#saldoAwal'+idAkun).text(toRp(saldo));
    }else{
      $('#saldoAwal'+idAkun).text(0);
    }
    if(tipeAkun == 'induk'){
      if(lastAkun == idAkun){
        console.log('kedua '+idAkun);
      }else{
        lastAkun = idAkun;
        console.log("tipe akun "+tipeAkun+' '+idAkun+' '+kodeAkun);
        if(kodeAkun == '4.100'){
        }else{
          totalPagePendapatan(kodeAkun,'saldoAwal', saldo, function(err, totalSaldo){
            $("#totalPendapatanSaldoAwal").text(toRp(totalSaldo));
            $("#totalAwalLR").text(toRp(totalSaldo));
          });
        }
      }
    }
  });
  return 'Loading...';
}

let lastAkunMutasiPendapatan = 0;
let saldoMutasiPendapatan = function(idAkun, tipeAkun, kodeAkun){
  getSaldoMutasi(idAkun, tipeAkun, kodeAkun, function(err, saldo){
    if(saldo){
      $('#saldoMutasi'+idAkun).text(toRp(saldo));
    }else{
      $('#saldoMutasi'+idAkun).text(0);
    }
    setTimeout(function(){
      let saldoAwal = parseCurrency($('#saldoAwal'+idAkun).text());
      let saldoAkhir = saldoAwal + saldo;
      $('#saldoAkhir'+idAkun).text(toRp(saldoAkhir));

      if(tipeAkun == 'induk'){
        if(lastAkunMutasiPendapatan == idAkun){
          console.log('kedua '+idAkun);
        }else{
          lastAkunMutasiPendapatan = idAkun;
          if(kodeAkun == '4.100'){
          }else{
            totalPagePendapatan(kodeAkun, 'saldoMutasi', saldo, function(err, totalSaldo){
              $("#totalPendapatanMutasi").text(toRp(totalSaldo));
              $("#totalMutasiLR").text(toRp(totalSaldo));
              let totalPendapatanAwal = parseCurrency($("#totalPendapatanSaldoAwal").text());
              let totalPendapatanAkhir = totalPendapatanAwal + totalSaldo;
              $('#totalPendapatanSaldoAkhir').text(toRp(totalPendapatanAkhir));
              let totalAwalLR = parseCurrency($("#totalAwalLR").text());
              let totalAkhirLR = totalAwalLR + totalSaldo;
              $("#totalAkhirLR").text(toRp(totalAkhirLR));
            });
          }
        }
      }
    },1000);
  });
  return 'Loading...';
}

let lastSaldoAwalAkunBeban = 0;
let saldoAwalBeban = function(idAkun, tipeAkun, kodeAkun){
  getSaldoAwal(idAkun, tipeAkun, kodeAkun, function(err, saldo){
    if(saldo){
      $('#saldoAwal'+idAkun).text(toRp(saldo));
    }else{
      $('#saldoAwal'+idAkun).text(0);
    }
    if(tipeAkun == 'induk'){
      if(lastSaldoAwalAkunBeban == idAkun){
        console.log('kedua '+idAkun);
      }else{
        lastSaldoAwalAkunBeban = idAkun;
        if(kodeAkun == '5.100'){
        }else{
          totalPageBeban(kodeAkun, 'saldoAwal', saldo, function(err, totalSaldo){
            $("#totalBebanSaldoAwal").text(toRp(totalSaldo));
            setTimeout(function(){
              let totalAwalPendapatan = parseCurrency($("#totalPendapatanSaldoAwal").text());
              let totalAwalBeban = parseCurrency($("#totalBebanSaldoAwal").text());
              let jumlahTotalAwal = totalAwalPendapatan - totalAwalBeban;
              $("#totalAwalLR").text(toRp(jumlahTotalAwal));
            },2000);
          });
        }
      }
    }
  });
  return 'Loading...';
}

let lastMutasiAkunBeban = 0;
function saldoMutasiBeban(idAkun, tipeAkun, kodeAkun){
  getSaldoMutasi(idAkun, tipeAkun, kodeAkun, function(err, saldo){
    console.log('saldo '+saldo +' kodeAkun '+kodeAkun);
    if(saldo){
      $('#saldoMutasi'+idAkun).text(toRp(saldo));
    }else{
      $('#saldoMutasi'+idAkun).text(0);
    }
    setTimeout(function(){
      let saldoAwal = parseCurrency($('#saldoAwal'+idAkun).text());
      let saldoAkhir = saldoAwal + saldo;
      $('#saldoAkhir'+idAkun).text(toRp(saldoAkhir));
      if(tipeAkun == 'induk'){
        if(lastMutasiAkunBeban == idAkun){
          console.log('kedua '+idAkun);
        }else{
          lastMutasiAkunBeban= idAkun;
          if(kodeAkun == '5.100'){
          }else{
            totalPageBeban(kodeAkun, 'saldoMutasi', saldo, function(err, totalSaldo){
              $("#totalBebanMutasi").text(toRp(totalSaldo));
              let totalBebanAwal = parseCurrency($("#totalBebanSaldoAwal").text());
              let totalBebanAkhir = totalBebanAwal + totalSaldo;
              $('#totalBebanSaldoAkhir').text(toRp(totalBebanAkhir));
              setTimeout(function(){
                let totalMutasiPendapatan = parseCurrency($("#totalPendapatanMutasi").text());
                let totalMutasiBeban = parseCurrency($("#totalBebanMutasi").text());
                let jumlahTotalMutasi = totalMutasiPendapatan - totalMutasiBeban;
                $("#totalMutasiLR").text(toRp(jumlahTotalMutasi));
                let totalAwalLR = parseCurrency($("#totalAwalLR").text());
                let jumlahTotalAkhir = totalAwalLR + jumlahTotalMutasi;
                $("#totalAkhirLR").text(toRp(jumlahTotalAkhir));
              },2000);
            });
          }
        }
      }
    },1000);
  });
  return 'Loading...';
}

let kodeAkunPendapatan1 = '4.100';
let totalPagePendapatan = function(kodeAkun, keterangan, saldo, callback){
  if(keterangan == 'saldoAwal'){
    let lastSaldo = $('#totalPendapatanSaldoAwal').text();
    if(lastSaldo == 'Loading...'){
      lastSaldo = 0;
    }else{
      lastSaldo = parseCurrency(lastSaldo);
    }
    if(kodeAkun == kodeAkunPendapatan1){
      console.log('tidak dijumlah '+kodeAkun);
    }else{
      lastSaldo += saldo;
    }
    callback(null, lastSaldo);
  }else if(keterangan = 'saldoMutasi'){
    let lastSaldo = $('#totalPendapatanMutasi').text();
    if(lastSaldo == 'Loading...'){
      lastSaldo = 0;
    }else{
      lastSaldo = parseCurrency(lastSaldo);
    }
    if(kodeAkun == kodeAkunPendapatan1){
      console.log('tidak dijumlah '+kodeAkun);
    }else{
      lastSaldo += saldo;
    }
    callback(null, lastSaldo);
  }
}

let kodeAkunBeban1 = '5.100';
let totalPageBeban = function(kodeAkun, keterangan, saldo, callback){
  if(keterangan == 'saldoAwal'){
    let lastSaldo = $('#totalBebanSaldoAwal').text();
    if(lastSaldo == 'Loading...'){
      lastSaldo = 0;
    }else{
      lastSaldo = parseCurrency(lastSaldo);
    }
    if(kodeAkun == kodeAkunBeban1){
      console.log('tidak dijumlah '+kodeAkun);
    }else{
      lastSaldo += saldo;
    }
    callback(null, lastSaldo);
  }else if(keterangan = 'saldoMutasi'){
    let lastSaldo = $('#totalBebanMutasi').text();
    if(lastSaldo == 'Loading...'){
      lastSaldo = 0;
    }else{
      lastSaldo = parseCurrency(lastSaldo);
    }
    if(kodeAkun == kodeAkunBeban1){
      console.log('tidak dijumlah '+kodeAkun);
    }else{
      lastSaldo += saldo;
    }
    callback(null, lastSaldo);
  }
}

function parseCurrency( num ) {
  return parseFloat( num.replace( /,/g, '') );
}

function toRp(a,b,c,d,e){e=function(f){return f.split('').reverse().join('')};b=e(parseInt(a,10).toString());for(c=0,d='';c<b.length;c++){d+=b[c];if((c+1)%3===0&&c!==(b.length-1)){d+=',';}}return'\t'+e(d)+''}

// Wrap IIFE around your code
(function($, viewport){
    $(document).ready(function() {

        // Executes only in XS breakpoint
        if(viewport.is('xs')) {
            // ...
        }

        // Executes in SM, MD and LG breakpoints
        if(viewport.is('>=sm')) {
            // ...
            let column = tablePendapatan.column(3);
            column.visible(!column.visible());
            column = tableBeban.column(3);
            column.visible(!column.visible());
        }

        // Executes in XS and SM breakpoints
        if(viewport.is('<md')) {
            // ...
            let column = tablePendapatan.column(0);
            column.visible(!column.visible());
            column = tablePendapatan.column(1);
            column.visible(!column.visible());
            column = tablePendapatan.column(2);
            column.visible(!column.visible());
            //pasiva
            column = tableBeban.column(0);
            column.visible(!column.visible());
            column = tableBeban.column(1);
            column.visible(!column.visible());
            column = tableBeban.column(2);
            column.visible(!column.visible());
        }

        // Execute code each time window size changes
        $(window).resize(
            viewport.changed(function() {
                if(viewport.is('xs')) {
                    // ...
                }
            })
        );
    });
})(jQuery, ResponsiveBootstrapToolkit);
