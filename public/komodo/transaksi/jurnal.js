'use strict';

//'pageLength' : 1,
let urlJson = $("#jUrl").val();
let table = $('#tableData').DataTable({
  'paging'      : true,
  'lengthChange': false,
  'searching'   : true,
  'ordering'    : false,
  'autoWidth'   : false,
  'info'        : true,
  'processing'  : true,
  'serverSide'  : true,
  'ajax' : urlJson,
  "order": [[ 1, "asc" ]],
  "dom" : 'tr',
  'pageLength' : 100,
  'columns' : [
    { "data": "hitung"},
    { "data": "kode_akun" },
    { "data": "nama_akun"},
    { "data": "debit"},
    { "data": "kredit"},
    { "mRender" : function(data, type, full){
      return '<span class="pull-right">'+toRp(full['debit'])+'</span>';
    }},
    { "mRender" : function(data, type, full){
      return '<span class="pull-right">'+toRp(full['kredit'])+'</span>';
    }},
    {
      "mRender": function(data, type, full) {
        return '<a class="btn btn-danger btn-xs" onClick=deleteTmp('+full['akun_perkiraan']+');'+ '>' + 'Hapus' + '</a>';
      }
    },
    {
      "mRender": function(data, type, full) {
        if(full['debit'] > 0){
          return '<div class="col-md-3">'+' <div class="box box-primary box-solid">'+' <div class="box-header with-border">'+' <h3 class="box-title">Debit: '+toRp(full['debit'])+'</h3>'+'<div class="box-tools pull-right">'+' </div>'+' </div>'+' <div class="box-body"><h5>'+full['kode_akun']+' - '+full['nama_akun']+'</h5> <a class="btn btn-danger" onClick=deleteTmp('+full['akun_id']+');'+ '>' + 'Hapus' + '</a> '+' </div>'+' </div>'+' </div>';
        }else if(full['kredit'] > 0 ){
          return '<div class="col-md-3">'+' <div class="box box-primary box-solid">'+' <div class="box-header with-border">'+' <h3 class="box-title">Kredit: '+toRp(full['kredit'])+'</h3>'+'<div class="box-tools pull-right">'+' </div>'+' </div>'+' <div class="box-body"><h5>'+full['kode_akun']+' - '+full['nama_akun']+'</h5> <a class="btn btn-danger" onClick=deleteTmp('+full['akun_id']+');'+ '>' + 'Hapus' + '</a> '+' </div>'+' </div>'+' </div>';
        }
      }
    },
  ]
});

function totalPage(){
  let totalPage = 0;
  let totalDebit = 0;
  let totalKredit = 0;
  setTimeout(function(){
    let column3 = table.column(3,{page:'current'}).data().reduce(function(a,b){
      return a+b;
    });
    let column4 = table.column(4, {page:'current'}).data().reduce(function(a,b){
      return a+b;
    });
    totalDebit = column3;
    totalKredit = column4;
    totalPage = column3+column4;
  },500);
  setTimeout(function(){
    $("#totalPage").text(toRp(totalPage));
    $("#totalDebit").text(toRp(totalDebit));
    $("#totalKredit").text(toRp(totalKredit));
  },1000);
}
totalPage();

function deleteTmp(id_akun){
  let urlDel = $("#dUrl").val();
  Swal.fire({
    title: 'Data akan dihapus?',
    type: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    reverseButtons: true,
  }).then((result) => {
    if (result.value) {
      Swal.fire({
        timer:1000,
        onOpen: () => {
          Swal.showLoading();
        }
      });
      setTimeout(function(){
        $.post(urlDel, {akun_perkiraan: id_akun}, function(data, status){
          //alert("data "+JSON.stringify(data));
          if(data.status == 'success'){
            Swal.fire({
              position: 'top-end',
              type: 'success',
              title: 'Data telah terhapus',
              showConfirmButton: false,
              timer: 2000
            }).then(function(){
              table.ajax.reload();
            }).then(function(){
              totalPage();
            });
          }else{
            Swal.fire({
              position: 'top-end',
              type: 'error',
              title: 'Data tidak terhapus',
              showConfirmButton: false,
              timer: 2000
            }).then(function(){
              table.ajax.reload();
            }).then(function(){
              totalPage();
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
      },1000);
    }
  });
}

$("#data_akun").on("select2:select",function(){
  $("#kredit").focus();
  $("#debit").focus();
});

$("#debit").on("keypress", function(event){
  if(event.which == 13){
    event.preventDefault();
    $("#kredit").focus();
  }
});

$("#kredit").on("keypress", function(event){
  if(event.which == 13){
    event.preventDefault();
    $(".ok_jurnal").focus();
  }
});

$(".ok_jurnal").on("click", function(){
  let id_akun = $("#data_akun").val();
  let debit = parseCurrency($("#debit").val());
  let kredit = parseCurrency($("#kredit").val());
  let url = $("#lastUrl").val();
  if(!id_akun){
    Swal.fire({
      position: 'top-end',
      type: 'warning',
      title: 'Akun perkiraan belum dipilih',
      showConfirmButton: false,
      timer: 3000
    });
  }else if(!debit && !kredit){
    Swal.fire({
      position: 'top-end',
      type: 'warning',
      title: 'Debit dan Kredit tidak boleh 0',
      showConfirmButton: false,
      timer: 3000
    });
  }else{
    $.post(url, {akun_perkiraan: id_akun, debit: debit, kredit: kredit, op: 'ok'}, function(data, status){
      //alert(JSON.stringify(data));
      if(data.status = 'success'){
        $("#data_akun").val('').trigger('change.select2');
        $("#debit").val('');
        $("#kredit").val('');
        table.ajax.reload();
        totalPage();
      }else{
        Swal.fire({
          position: 'top-end',
          type: 'warning',
          title: data.message,
          showConfirmButton: false,
          timer: 3000
        });
      }
    }).fail(function(){
      Swal.fire({
        position: 'top-end',
        type: 'warning',
        title: 'url salah',
        showConfirmButton: false,
        timer: 3000
      });
    });
  }
});

$("#submitJurnal").on("click", function(event){
  event.preventDefault();
  let keterangan = $("#ket_jurnal").val();
  let sdebit = parseCurrency($("#totalDebit").text());
  let skredit = parseCurrency($("#totalKredit").text());
  if(!keterangan){
    Swal.fire({
      position: 'top-end',
      type: 'warning',
      title: 'keterangan belum diisi',
      showConfirmButton: false,
      timer: 3000
    });
  }else if(sdebit != skredit){
    Swal.fire({
      position: 'top-end',
      type: 'warning',
      title: 'Total Debit tidak sama dengan total Kredit',
      showConfirmButton: false,
      timer: 3000
    });
  }else{
    Swal.fire({
      timer:3000,
      onOpen: () => {
        Swal.showLoading();
      }
    });
    $('form').submit();
  }
});

$("#debit").priceFormat({ prefix: '', centsLimit: 0});
$("#kredit").priceFormat({ prefix: '', centsLimit: 0});

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
            let column = table.column(3);
            column.visible(!column.visible());
            column = table.column(4);
            column.visible(!column.visible());
            column = table.column(8);
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
            column = table.column(7);
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
