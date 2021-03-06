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
    { "data": "tanggal"},
    { "data": "id" },
    { "data": "tipe"},
    { "mRender": function(data, type, full){
      if(full['debit'] != 0){
        return '<span class="pull-right">'+toRp(full['debit'])+'</span>';
      }else{
        return '';
      }
    }},
    { "mRender": function(data, type, full){
      if(full['kredit'] != 0){
        return '<span class="pull-right">'+toRp(full['kredit'])+'</span>';
      }else{
        return '';
      }
    }},
    { "mRender": function(data, type, full){
      return '<span class="pull-right">'+toRp(full['saldo'])+'</span>';
    }},
  ]
});

function updateTipe(depositID){
  let tsor = $('#tableData').dataTable();
  let ins = tsor.fnGetData();
  let a = tsor.fnGetNodes();
  let tipeDeposit = null;
  $.each(tsor.fnGetNodes(), function (index, value) {
    if(!tipeDeposit)
      tipeDeposit = $(value).find('select').val();
  });
  console.log("deposit id "+depositID);
  console.log("tipe deposit "+tipeDeposit);
  $.post("/transaksi/deposit", {deposit_id: depositID, tipe_deposit:tipeDeposit}, function(data, status){
    if(data.status == 'success'){
      Swal.fire({
        position: 'top-end',
        type: 'success',
        title: 'Tipe Deposit berhasil diupdate',
        showConfirmButton: false,
        timer: 2000
      }).then(function(){
        table.ajax.reload( null, false );
      });
    }else{
      Swal.fire({
        position: 'top-end',
        type: 'error',
        title: 'Tipe Deposit gagal diupdate',
        showConfirmButton: false,
        timer: 2000
      }).then(function(){
        table.ajax.reload( null, false );
      });
    }
  }).fail(function(){
    Swal.fire({
      position: 'top-end',
      type: 'error',
      title: 'Url tidak ditemukan',
      showConfirmButton: false,
      timer: 3000
    });
  });
}

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
