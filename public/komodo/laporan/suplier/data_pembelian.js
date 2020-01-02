'use strict';

//'pageLength' : 1,
let urlMutasi = $("#urlMutasi").val();
let table = $('#tableData').DataTable({
  'paging'      : true,
  'lengthChange': true,
  'searching'   : true,
  'ordering'    : true,
  'autoWidth'   : false,
  'info'        : true,
  'processing'  : true,
  'serverSide'  : true,
  'ajax' : urlMutasi,
  "dom" : "<'row'<'col-sm-6'l>>" +
"<'row'<'col-sm-12'tr>>" +
"<'row'<'col-sm-5'i><'col-sm-7'p>>",
  'columns' : [
    { "data": "tsView"},
    { "mRender" : function(data, type, full){
      return '<a href="javascript:void(0);" onClick="jurnal('+full['jurnal']+')">'+full['pembelian_id']+'</a>';
    }},
    { "mRender": function(data, type, full){
      if(full['tipe_pembelian'] == 'tunai'){
        return '<span>Tunai</span>';
      }else if(full['tipe_pembelian'] == 'transfer'){
        return '<span>Transfer</span>';
      }else if(full['tipe_pembelian'] == 'hutang'){
        return '<span>Hutang</span>';
      }
    }},
    { "data" : "keterangan_pembelian"},
    { "mRender": function(data, type, full){
      if(full['nominal'] > 0){
        return '<span class="pull-right">'+toRp(full['nominal'])+'</span>';
      }else{
        return '';
      }
    }},
    { "mRender": function(data, type, full){
      if(full['nominal_diskon'] > 0){
        return '<span class="pull-right">'+toRp(full['nominal_diskon'])+'</span>';
      }else{
        return '';
      }
    }},
    { "mRender": function(data, type, full){
      if(full['tipe_pembelian'] == 'hutang'){
        return '<span class="pull-right">'+toRp(full['nominal'] - full['sisa_pembayaran'])+'</span>';
      }else{
        return '';
      }
    }},
    { "mRender": function(data, type, full){
      if(full['sisa_pembayaran'] > 0){
        return '<span class="pull-right">'+toRp(full['sisa_pembayaran'])+'</span>';
      }else{
        return '';
      }
    }},
  ]
});

$(document).ready(function(){
  setTimeout(function(){
    $("#cari").trigger('click', function(event){
      event.preventDefault();
      let tanggal = $("#dmy1").val();
      let tanggal2 = $("#dmy2").val();
      table.search(tanggal+'_'+tanggal2).draw();
    });
  },500);
});

$("#cari").on("click", function(event){
  event.preventDefault();
  let tanggal = $("#dmy1").val();
  let tanggal2 = $("#dmy2").val();
  table.search(tanggal+'_'+tanggal2).draw();
});

function jurnal(idJurnal){
  $(location).attr('href','/laporan/pembelian/detailJurnal/'+idJurnal);
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
            /*let column = table.column(9);
            column.visible(!column.visible());*/
        }

        // Executes in XS and SM breakpoints
        if(viewport.is('<md')) {
            // ...
            /*let column = table.column(0);
            column.visible(!column.visible());
            column = table.column(1);*/
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
