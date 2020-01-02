'use strict';

//'pageLength' : 1,
let table = $('#tableData').DataTable({
  'paging'      : true,
  'lengthChange': true,
  'searching'   : true,
  'ordering'    : false,
  'autoWidth'   : false,
  'info'        : true,
  'processing'  : true,
  'serverSide'  : true,
  'ajax' : '/laporan/akuntansi/bukubesarJson',
  "order": [[ 1, "asc" ]],
  "dom" : 'lrtp',
  'columns' : [
    { "data": "tglView", name: 'tanggal'},
    { "data": "faktur", name: 'fakturJ'},
    { "data": "keterangan", name: 'keteranganJ'},
    { "mRender" : function(data, type, full){
      if(full['debit'] > 0){
        return '<span class="pull-right">'+toRp(full['debit'])+'</span>';
      }else{
        return '<span class="pull-right"></span>';
      }
    }},
    { "mRender" : function(data, type, full){
      if(full['kredit'] > 0){
        return '<span class="pull-right">'+toRp(full['kredit'])+'</span>';
      }else{
        return '<span class="pull-right"></span>';
      }
    }},
    { "mRender" : function(data, type, full){
      if(full['saldo_debit'] > 0){
        return '<span class="pull-right">'+toRp(full['saldo_debit'])+'</span>';
      }else{
        return '<span class="pull-right"></span>';
      }
    }},
    { "mRender" : function(data, type, full){
      if(full['saldo_kredit'] > 0){
        return '<span class="pull-right">'+toRp(full['saldo_kredit'])+'</span>';
      }else{
        return '<span class="pull-right"></span>';
      }
    }},
    {
      "mRender": function(data, type, full) {
        if(full['debit'] > 0){
          if(full['kode_akun'].match('^2') || full['kode_akun'].match('^3') || full['kode_akun'].match('^4')){
            return '<div class="col-md-3">'+' <div class="box box-primary box-solid">'+' <div class="box-header with-border">'+' <h3 class="box-title">'+full['faktur']+'</h3>'+'<div class="box-tools pull-right">'+' </div>'+' </div>'+' <div class="box-body"><h5>'+full['tglView']+'</h5><h5>'+full['keterangan']+'</h5><h5>Debit: '+toRp(full['debit'])+'</h5> <h5>Saldo: '+toRp(full['saldo_kredit'])+'</h5></div>'+' </div>'+' </div>';
          }else{
            return '<div class="col-md-3">'+' <div class="box box-primary box-solid">'+' <div class="box-header with-border">'+' <h3 class="box-title">'+full['faktur']+'</h3>'+'<div class="box-tools pull-right">'+' </div>'+' </div>'+' <div class="box-body"><h5>'+full['tglView']+'</h5><h5>'+full['keterangan']+'</h5><h5>Debit: '+toRp(full['debit'])+'</h5> <h5>Saldo: '+toRp(full['saldo_debit'])+'</h5></div>'+' </div>'+' </div>';
          }
        }else if(full['kredit'] > 0 ){
          if(full['kode_akun'].match('^1') || full['kode_akun'].match('^5')){
            return '<div class="col-md-3">'+' <div class="box box-primary box-solid">'+' <div class="box-header with-border">'+' <h3 class="box-title">'+full['faktur']+'</h3>'+'<div class="box-tools pull-right">'+' </div>'+' </div>'+' <div class="box-body"><h5>'+full['tglView']+'</h5><h5>'+full['keterangan']+'</h5><h5>Kredit: '+toRp(full['kredit'])+'</h5> <h5>Saldo: '+toRp(full['saldo_debit'])+'</h5></div>'+' </div>'+' </div>';
          }else{
            return '<div class="col-md-3">'+' <div class="box box-primary box-solid">'+' <div class="box-header with-border">'+' <h3 class="box-title">'+full['faktur']+'</h3>'+'<div class="box-tools pull-right">'+' </div>'+' </div>'+' <div class="box-body"><h5>'+full['tglView']+'</h5><h5>'+full['keterangan']+'</h5><h5>Kredit: '+toRp(full['kredit'])+'</h5> <h5>Saldo: '+toRp(full['saldo_kredit'])+'</h5></div>'+' </div>'+' </div>';
          }
        }else{
          if(full['saldo_kredit'] > 0){
            return '<div class="col-md-3">'+' <div class="box box-primary box-solid">'+' <div class="box-header with-border">'+' <h3 class="box-title">'+toRp(full['saldo_kredit'])+'</h3>'+'<div class="box-tools pull-right">'+' </div>'+' </div>'+' <div class="box-body"><h5>'+full['keterangan']+'</h5> </div>'+' </div>'+' </div>';
          }else{
            return '<div class="col-md-3">'+' <div class="box box-primary box-solid">'+' <div class="box-header with-border">'+' <h3 class="box-title">'+toRp(full['saldo_debit'])+'</h3>'+'<div class="box-tools pull-right">'+' </div>'+' </div>'+' <div class="box-body"><h5>'+full['keterangan']+'</h5> </div>'+' </div>'+' </div>';
          }
        }
      }
    },
  ],
    rowsGroup: [
      'tanggal:name',
      'fakturJ:name',
      'keteranganJ:name'
    ],
});

$(document).ready(function(){
  setTimeout(function(){
    $("#cari").trigger('click', function(event){
      event.preventDefault();
      let drTgl = $("#dmy1").val();
      let smTgl = $("#dmy2").val();
      let akunID = $("#data_akun").val();
      let keterangan = $("#keterangan").val();
      table.search(drTgl+'_'+smTgl+'_'+akunID+'_'+keterangan).draw();
    });
  },500);
});

$("#cari").on("click", function(event){
  event.preventDefault();
  let drTgl = $("#dmy1").val();
  let smTgl = $("#dmy2").val();
  let akunID = $("#data_akun").val();
  let keterangan = $("#keterangan").val();
  table.search(drTgl+'_'+smTgl+'_'+akunID+'_'+keterangan).draw();
});

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
            let column = table.column(7);
            column.visible(!column.visible());
        }

        // Executes in XS and SM breakpoints
        if(viewport.is('<md')) {
            // ...
            let column = table.column(0);
            column.visible(!column.visible());
            column = table.column(1);
            column.visible(!column.visible());
            column = table.column(2);
            column.visible(!column.visible());
            column = table.column(3);
            column.visible(!column.visible());
            column = table.column(4);
            column.visible(!column.visible());
            column = table.column(5);
            column.visible(!column.visible());
            column = table.column(6);
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
