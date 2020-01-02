'use strict';

//'pageLength' : 1,
let tableAktiva = $('#tableDataAktiva').DataTable({
  'paging'      : true,
  'lengthChange': true,
  'searching'   : true,
  'ordering'    : false,
  'autoWidth'   : false,
  'info'        : true,
  'processing'  : true,
  'serverSide'  : true,
  'ajax' : '/laporan/akuntansi/neraca/harian/aktivaJson',
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
        return '<span class="pull-right text-bold" id="saldoAwal'+full['akun_id']+'">'+saldoAwalAktiva(full['akun_id'], full['tipe_akun'], full['kode_akun'])+'</span>';
      }else{
        return '<span class="pull-right" id="saldoAwal'+full['akun_id']+'">'+saldoAwalAktiva(full['akun_id'], full['tipe_akun'], full['kode_akun'])+'</span>';
      }
    }},
    { "mRender" : function(data, type, full){
      if(full['tipe_akun'] == 'induk'){
        return '<span class="pull-right text-bold" id="saldoMutasi'+full['akun_id']+'">'+saldoMutasiAktiva(full['akun_id'], full['tipe_akun'], full['kode_akun'])+'</span>';
      }else{
        return '<span class="pull-right" id="saldoMutasi'+full['akun_id']+'">'+saldoMutasiAktiva(full['akun_id'], full['tipe_akun'], full['kode_akun'])+'</span>';
      }
    }},
    { "mRender" : function(data, type, full){
      if(full['tipe_akun'] == 'induk'){
        return '<span class="pull-right text-bold" id="saldoAkhir'+full['akun_id']+'">Loading...</span>';
      }else{
        return '<span class="pull-right" id="saldoAkhir'+full['akun_id']+'">Loading...</span>';
      }
    }},
    { "mRender" : function(data, type, full){
      if(full['tipe_akun'] == 'induk'){
        return '<div class="col-md-3">'+' <div class="box box-primary box-solid">'+' <div class="box-header with-border">'+' <h3 class="box-title text-bold">'+full['kode_akun']+'</h3>'+'<div class="box-tools pull-right">'+' </div>'+' </div>'+' <div class="box-body"><h5 class="text-bold">'+full['nama_akun']+'</h5><h5 class="text-bold">Saldo Awal: <span id="saldoAwal'+full['akun_id']+'"></span></h5><h5 class="text-bold">Mutasi: <span id="saldoMutasi'+full['akun_id']+'"></span></h5> <h5 class="text-bold">Saldo Akhir: <span id="saldoAkhir'+full['akun_id']+'">Loading...</span></h5></div>'+' </div>'+' </div>';
      }else{
        return '<div class="col-md-3">'+' <div class="box box-primary box-solid">'+' <div class="box-header with-border">'+' <h3 class="box-title">'+full['kode_akun']+'</h3>'+'<div class="box-tools pull-right">'+' </div>'+' </div>'+' <div class="box-body"><h5>'+full['nama_akun']+'</h5><h5>Saldo Awal: <span id="saldoAwal'+full['akun_id']+'"></span></h5><h5>Mutasi: <span id="saldoMutasi'+full['akun_id']+'"></span></h5> <h5>Saldo Akhir: <span id="saldoAkhir'+full['akun_id']+'">Loading...</span></h5></div>'+' </div>'+' </div>';
      }
    }}
  ]
});

let tablePasiva = $('#tableDataPasiva').DataTable({
  'paging'      : true,
  'lengthChange': true,
  'searching'   : true,
  'ordering'    : false,
  'autoWidth'   : false,
  'info'        : true,
  'processing'  : true,
  'serverSide'  : true,
  'ajax' : '/laporan/akuntansi/neraca/harian/pasivaJson',
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
        return '<span class="pull-right text-bold" id="saldoAwal'+full['akun_id']+'">'+saldoAwalPasiva(full['akun_id'], full['tipe_akun'], full['kode_akun'])+'</span>';
      }else{
        return '<span class="pull-right" id="saldoAwal'+full['akun_id']+'">'+saldoAwalPasiva(full['akun_id'], full['tipe_akun'], full['kode_akun'])+'</span>';
      }
    }},
    { "mRender" : function(data, type, full){
      if(full['tipe_akun'] == 'induk'){
        return '<span class="pull-right text-bold" id="saldoMutasi'+full['akun_id']+'">'+saldoMutasiPasiva(full['akun_id'], full['tipe_akun'], full['kode_akun'])+'</span>';
      }else{
        return '<span class="pull-right" id="saldoMutasi'+full['akun_id']+'">'+saldoMutasiPasiva(full['akun_id'], full['tipe_akun'], full['kode_akun'])+'</span>';
      }
    }},
    { "mRender" : function(data, type, full){
      if(full['tipe_akun'] == 'induk'){
        return '<span class="pull-right text-bold" id="saldoAkhir'+full['akun_id']+'">Loading...</span>';
      }else{
        return '<span class="pull-right" id="saldoAkhir'+full['akun_id']+'">Loading...</span>';
      }
    }},
    { "mRender" : function(data, type, full){
      if(full['tipe_akun'] == 'induk'){
        return '<div class="col-md-3">'+' <div class="box box-primary box-solid">'+' <div class="box-header with-border">'+' <h3 class="box-title text-bold">'+full['kode_akun']+'</h3>'+'<div class="box-tools pull-right">'+' </div>'+' </div>'+' <div class="box-body"><h5 class="text-bold">'+full['nama_akun']+'</h5><h5 class="text-bold">Saldo Awal: <span id="saldoAwal'+full['akun_id']+'"></span></h5><h5 class="text-bold">Mutasi: <span id="saldoMutasi'+full['akun_id']+'"></span></h5> <h5 class="text-bold">Saldo Akhir: <span id="saldoAkhir'+full['akun_id']+'">Loading...</span></h5></div>'+' </div>'+' </div>';
      }else{
        return '<div class="col-md-3">'+' <div class="box box-primary box-solid">'+' <div class="box-header with-border">'+' <h3 class="box-title">'+full['kode_akun']+'</h3>'+'<div class="box-tools pull-right">'+' </div>'+' </div>'+' <div class="box-body"><h5>'+full['nama_akun']+'</h5><h5>Saldo Awal: <span id="saldoAwal'+full['akun_id']+'"></span></h5><h5>Mutasi: <span id="saldoMutasi'+full['akun_id']+'"></span></h5> <h5>Saldo Akhir: <span id="saldoAkhir'+full['akun_id']+'">Loading...</span></h5></div>'+' </div>'+' </div>';
      }
    }}
  ]
});

$("#cari").on("click", function(event){
  event.preventDefault();
  let drTgl = $("#dmy1").val();
  let smTgl = $("#dmy2").val();
  $("#totalAktivaSaldoAwal").text(0);
  $("#totalAktivaMutasi").text(0);
  $("#totalAktivaSaldoAkhir").text(0);
  $("#totalPasivaSaldoAwal").text(0);
  $("#totalPasivaMutasi").text(0);
  $("#totalPasivaSaldoAkhir").text(0);
  tableAktiva.search(drTgl+'_'+smTgl).draw();
  tablePasiva.search(drTgl+'_'+smTgl).draw();
});

let getSaldoAwal = function (idAkun, tipeAkun, kodeAkun, callback){
  let dmy1 = $('#dmy1').val();
  $.get('/laporan/akuntansi/neraca/harian/saldoAkun/'+idAkun+'/'+tipeAkun+'/'+kodeAkun, {tanggal:dmy1}, function(data, status){
    callback(null, data.saldo);
  }).fail(function(){
    callback('gagal', 0);
  });
}

let getSaldoMutasi = function(idAkun, tipeAkun, kodeAkun, callback){
  let dmy1 = $('#dmy1').val();
  let dmy2 = $('#dmy2').val();
  $.get('/laporan/akuntansi/neraca/harian/saldoMutasiAkun/'+idAkun+'/'+tipeAkun+'/'+kodeAkun, {tanggal:dmy1, tanggal2:dmy2}, function(data, status){
    callback(null, data.saldo);
  }).fail(function(){
    callback('gagal', 0);
  });
}

let lastAkun = 0;
let saldoAwalAktiva = function(idAkun, tipeAkun, kodeAkun){
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
        totalPageAktiva(kodeAkun, 'saldoAwal', saldo, function(err, totalSaldo){
          $("#totalAktivaSaldoAwal").text(toRp(totalSaldo));
        });
      }
    }
  });
  return 'Loading...';
}

let lastAkunMutasiAktiva = 0;
let saldoMutasiAktiva = function(idAkun, tipeAkun, kodeAkun){
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
        if(lastAkunMutasiAktiva == idAkun){
          console.log('kedua '+idAkun);
        }else{
          lastAkunMutasiAktiva = idAkun;
          totalPageAktiva(kodeAkun, 'saldoMutasi', saldo, function(err, totalSaldo){
            $("#totalAktivaMutasi").text(toRp(totalSaldo));
            let totalAktivaAwal = parseCurrency($("#totalAktivaSaldoAwal").text());
            let totalAktivaAkhir = totalAktivaAwal + totalSaldo;
            $('#totalAktivaSaldoAkhir').text(toRp(totalAktivaAkhir));
          });
        }
      }
    },1000);
  });
  return 'Loading...';
}

let lastSaldoAwalAkunPasiva = 0;
let saldoAwalPasiva = function(idAkun, tipeAkun, kodeAkun){
  if(kodeAkun == '3.300' || kodeAkun == '3.300.10'){
    if(kodeAkun == '3.300.10'){
      setTimeout(function(){
        let saldoInduk = parseCurrency($('#saldoAwal54').text());
        if(saldoInduk == 0 || saldoInduk == 'Loading...'){
          setTimeout(function(){
            saldoInduk = parseCurrency($('#saldoAwal54').text());
            $('#saldoAwal'+idAkun).text(toRp(saldoInduk));
          },1500);
        }else{
          $('#saldoAwal'+idAkun).text(toRp(saldoInduk));
        }
      },1500);
    }else{
      getSaldoAwal(idAkun, tipeAkun, 4, function(err, saldo){
        let saldoLR = 0;
        if(saldo){
          saldoLR = saldo;
          $('#saldoAwal'+idAkun).text(toRp(saldo));
          getSaldoAwal(idAkun, tipeAkun, 5, function(err, saldo){
            if(saldo){
              saldoLR -= saldo;
              $('#saldoAwal'+idAkun).text(toRp(saldoLR));
              if(tipeAkun == 'induk'){
                totalPagePasiva('saldoAwal', saldoLR, function(err, totalSaldo){
                  $("#totalPasivaSaldoAwal").text(toRp(totalSaldo));
                });
              }
            }else{
              $('#saldoAwal'+idAkun).text(saldoLR);
            }
          });
        }else{
          $('#saldoAwal'+idAkun).text(0);
          getSaldoAwal(idAkun, tipeAkun, 5, function(err, saldo){
            if(saldo){
              saldoLR -= saldo;
              $('#saldoAwal'+idAkun).text(toRp(saldoLR));
              if(tipeAkun == 'induk'){
                totalPagePasiva('saldoAwal', saldoLR, function(err, totalSaldo){
                  $("#totalPasivaSaldoAwal").text(toRp(totalSaldo));
                });
              }
            }else{
              $('#saldoAwal'+idAkun).text(saldoLR);
            }
          });
        }
      });
    }
  }else{
    getSaldoAwal(idAkun, tipeAkun, kodeAkun, function(err, saldo){
      if(saldo){
        $('#saldoAwal'+idAkun).text(toRp(saldo));
      }else{
        $('#saldoAwal'+idAkun).text(0);
      }
      if(tipeAkun == 'induk'){
        if(lastSaldoAwalAkunPasiva == idAkun){
          console.log('kedua '+idAkun);
        }else{
          lastSaldoAwalAkunPasiva = idAkun;
          totalPagePasiva('saldoAwal', saldo, function(err, totalSaldo){
            $("#totalPasivaSaldoAwal").text(toRp(totalSaldo));
          });
        }
      }
    });
  }
  return 'Loading...';
}

let lastMutasiAkunPasiva = 0;
function saldoMutasiPasiva(idAkun, tipeAkun, kodeAkun){
  if(kodeAkun == '3.300' || kodeAkun == '3.300.10'){
    if(kodeAkun == '3.300.10'){
      setTimeout(function(){
        let saldoInduk = parseCurrency($('#saldoMutasi54').text());
        let saldoAwalInduk = parseCurrency($('#saldoAwal54').text());
        if(saldoInduk == 0 || saldoInduk == 'Loading...'){
          setTimeout(function(){
            saldoAwalInduk = parseCurrency($('#saldoAwal54').text());
            saldoInduk = parseCurrency($('#saldoMutasi54').text());
            let saldoAkhirMutasi = saldoInduk + saldoAwalInduk;
            $('#saldoMutasi'+idAkun).text(toRp(saldoInduk));
            $('#saldoAkhir'+idAkun).text(toRp(saldoAkhirMutasi));
          },2000);
        }else{
          let saldoAkhirMutasi = saldoInduk + saldoAwalInduk;
          $('#saldoMutasi'+idAkun).text(toRp(saldoInduk));
          $('#saldoAkhir'+idAkun).text(toRp(saldoAkhirMutasi));
        }
      },2000);
    }else{
      getSaldoMutasi(idAkun, tipeAkun, 4, function(err, saldo){
        console.log('saldo '+saldo +' kodeAkun '+kodeAkun);
        let saldoLR = 0;
        if(saldo){
          saldoLR = saldo;
          $('#saldoMutasi'+idAkun).text(toRp(saldoLR));
        }else{
          $('#saldoMutasi'+idAkun).text(0);
        }
        setTimeout(function(){
          getSaldoMutasi(idAkun, tipeAkun, 5, function(err, saldo){
            if(saldo){
              saldoLR -= saldo;
              $('#saldoMutasi'+idAkun).text(toRp(saldoLR));
              let saldoAwal = parseCurrency($('#saldoAwal'+idAkun).text());
              let saldoAkhir = saldoAwal + saldoLR;
              $('#saldoAkhir'+idAkun).text(toRp(saldoAkhir));
              if(tipeAkun == 'induk'){
                if(lastMutasiAkunPasiva == idAkun){
                  console.log('kedua '+idAkun);
                }else{
                  lastMutasiAkunPasiva = idAkun;
                  totalPagePasiva('saldoMutasi', saldoLR, function(err, totalSaldo){
                    $("#totalPasivaMutasi").text(toRp(totalSaldo));
                    let totalPasivaAwal = parseCurrency($("#totalPasivaSaldoAwal").text());
                    let totalPasivaAkhir = totalPasivaAwal + totalSaldo;
                    $('#totalPasivaSaldoAkhir').text(toRp(totalPasivaAkhir));
                  });
                }
              }
            }else{
              $('#saldoMutasi'+idAkun).text(toRp(saldoLR));
              let saldoAwal = parseCurrency($('#saldoAwal'+idAkun).text());
              let saldoAkhir = saldoAwal + saldoLR;
              $('#saldoAkhir'+idAkun).text(toRp(saldoAkhir));
              if(tipeAkun == 'induk'){
                if(lastMutasiAkunPasiva == idAkun){
                  console.log('kedua '+idAkun);
                }else{
                  lastMutasiAkunPasiva = idAkun;
                  totalPagePasiva('saldoMutasi', saldoLR, function(err, totalSaldo){
                    $("#totalPasivaMutasi").text(toRp(totalSaldo));
                    let totalPasivaAwal = parseCurrency($("#totalPasivaSaldoAwal").text());
                    let totalPasivaAkhir = totalPasivaAwal + totalSaldo;
                    $('#totalPasivaSaldoAkhir').text(toRp(totalPasivaAkhir));
                  });
                }
              }
            }
          });
        },1000);
      });
    }
  }else{
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
          if(lastMutasiAkunPasiva == idAkun){
            console.log('kedua '+idAkun);
          }else{
            lastMutasiAkunPasiva = idAkun;
            totalPagePasiva('saldoMutasi', saldo, function(err, totalSaldo){
              $("#totalPasivaMutasi").text(toRp(totalSaldo));
              let totalPasivaAwal = parseCurrency($("#totalPasivaSaldoAwal").text());
              let totalPasivaAkhir = totalPasivaAwal + totalSaldo;
              $('#totalPasivaSaldoAkhir').text(toRp(totalPasivaAkhir));
            });
          }
        }
      },1000);
    });
  }
  return 'Loading...';
}

let kodeAkunAktiva1 = '1.200.10';
let kodeAkunAktiva2 = '1.200.20';
let kodeAkunAktiva3 = '1.400.10';
let kodeAkunAktiva4 = '1.400.20';
let kodeAkunAktiva5 = '1.400.30';
let totalPageAktiva = function(kodeAkun, keterangan, saldo, callback){
  if(keterangan == 'saldoAwal'){
    let lastSaldo = $('#totalAktivaSaldoAwal').text();
    if(lastSaldo == 'Loading...'){
      lastSaldo = 0;
    }else{
      lastSaldo = parseCurrency(lastSaldo);
    }
    if(kodeAkun == kodeAkunAktiva1){
      console.log('tidak dijumlah '+kodeAkun);
    }else if(kodeAkun == kodeAkunAktiva2){
      console.log('tidak dijumlah '+kodeAkun);
    }else if(kodeAkun == kodeAkunAktiva3){
      console.log('tidak dijumlah '+kodeAkun);
    }else if(kodeAkun == kodeAkunAktiva4){
      console.log('tidak dijumlah '+kodeAkun);
    }else if(kodeAkun == kodeAkunAktiva5){
      console.log('tidak dijumlah '+kodeAkun);
    }else{
      lastSaldo += saldo;
    }
    callback(null, lastSaldo);
  }else if(keterangan = 'saldoMutasi'){
    let lastSaldo = $('#totalAktivaMutasi').text();
    if(lastSaldo == 'Loading...'){
      lastSaldo = 0;
    }else{
      lastSaldo = parseCurrency(lastSaldo);
    }
    if(kodeAkun == kodeAkunAktiva1){
      console.log('tidak dijumlah '+kodeAkun);
    }else if(kodeAkun == kodeAkunAktiva2){
      console.log('tidak dijumlah '+kodeAkun);
    }else if(kodeAkun == kodeAkunAktiva3){
      console.log('tidak dijumlah '+kodeAkun);
    }else if(kodeAkun == kodeAkunAktiva4){
      console.log('tidak dijumlah '+kodeAkun);
    }else if(kodeAkun == kodeAkunAktiva5){
      console.log('tidak dijumlah '+kodeAkun);
    }else{
      lastSaldo += saldo;
    }
    callback(null, lastSaldo);
  }
}

let totalPagePasiva = function(keterangan, saldo, callback){
  if(keterangan == 'saldoAwal'){
    let lastSaldo = $('#totalPasivaSaldoAwal').text();
    if(lastSaldo == 'Loading...'){
      lastSaldo = 0;
    }else{
      lastSaldo = parseCurrency(lastSaldo);
    }
    lastSaldo += saldo;
    callback(null, lastSaldo);
  }else if(keterangan = 'saldoMutasi'){
    let lastSaldo = $('#totalPasivaMutasi').text();
    if(lastSaldo == 'Loading...'){
      lastSaldo = 0;
    }else{
      lastSaldo = parseCurrency(lastSaldo);
    }
    lastSaldo += saldo;
    callback(null, lastSaldo);
  }
}

//totalPageAktivaNew();

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
            let column = tableAktiva.column(5);
            column.visible(!column.visible());
            column = tablePasiva.column(5);
            column.visible(!column.visible());
        }

        // Executes in XS and SM breakpoints
        if(viewport.is('<md')) {
            // ...
            let column = tableAktiva.column(0);
            column.visible(!column.visible());
            column = tableAktiva.column(1);
            column.visible(!column.visible());
            column = tableAktiva.column(2);
            column.visible(!column.visible());
            column = tableAktiva.column(3);
            column.visible(!column.visible());
            column = tableAktiva.column(4);
            column.visible(!column.visible());
            //pasiva
            column = tablePasiva.column(0);
            column.visible(!column.visible());
            column = tablePasiva.column(1);
            column.visible(!column.visible());
            column = tablePasiva.column(2);
            column.visible(!column.visible());
            column = tablePasiva.column(3);
            column.visible(!column.visible());
            column = tablePasiva.column(4);
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
