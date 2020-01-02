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
  'dom':'',
  'columns' : [
    { "data": "deposit_id"},
    { "data": "komodo_mutasi_id"},
    { "data": "tglView" },
    { "data": "nama_lengkap"},
    { "mRender": function(data, type, full){
      return '<span class="right">'+toRp(full['nominal'])+'</span>'
    }},
    { "data": "keterangan"},
    { "data": "catatan"},
    { "mRender": function(data, type, full){
      if(full['deposit_tipe']){
        return '<a href="javascript:void(0);"> <span>'+full['nama_deposit']+'</span></a>';
      }else{
        return '<select class="form-control tipeDeposit" onchange="updateTipe('+full['deposit_id']+')" style="width: 100%;" name="akun_perkiraan" data-placeholder="Pilih Tipe Deposit"><option></option><option value="1">Deposit Hutang</option><option value="2">Deposit BCA 117-048-8888 an/Tedi Hartono</option><option value="3">Deposit BCA 117-027-7771 an/Tedi Hartono</option><option value="4">Deposit MANDIRI 11-4000-999-888-4 a/n TEDI HARTONO</option><option value="5">Deposit BRI 0130-01-000296-56-5 an/ Lia Faroka</option><option value="6">Deposit Kas Utama</option></select>';
      }
    }},
    { "mRender": function(data, type, full){
      return '<select class="form-control tipeDeposit" onchange="editTipe('+full['deposit_id']+','+full['jurnal']+')" style="width: 100%;" name="akun_perkiraan" data-placeholder="Pilih Tipe Deposit"><option></option><option value="1">Deposit Hutang</option><option value="2">Deposit BCA 117-048-8888 an/Tedi Hartono</option><option value="3">Deposit BCA 117-027-7771 an/Tedi Hartono</option><option value="4">Deposit MANDIRI 11-4000-999-888-4 a/n TEDI HARTONO</option><option value="5">Deposit BRI 0130-01-000296-56-5 an/ Lia Faroka</option><option value="6">Deposit Kas Utama</option></select>';
    }}
  ]
});

let urlMutasiJurnal = $("#urlMutasiJurnal").val();
let tableJurnal = $('#tableDataJurnal').DataTable({
  'paging'      : true,
  'lengthChange': true,
  'searching'   : true,
  'ordering'    : false,
  'autoWidth'   : false,
  'info'        : true,
  'processing'  : true,
  'serverSide'  : true,
  'ajax' : urlMutasiJurnal,
  "order": [[ 1, "asc" ]],
  "dom" : '',
  'columns' : [
    { "data": "tglView", name: 'tanggal'},
    { "data": "faktur", name: 'fakturJ'},
    { "data": "keterangan", name: 'keteranganJ'},
    { "data": "kode_akun"},
    { "data": "nama_akun"},
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
    }}
  ],
    rowsGroup: [
      'tanggal:name',
      'fakturJ:name',
      'keteranganJ:name'
    ],
});

function editTipe(depositID, jurnalID){
  let tsor = $('#tableData').dataTable();
  let ins = tsor.fnGetData();
  let a = tsor.fnGetNodes();
  let tipeDeposit = null;
  $.each(tsor.fnGetNodes(), function (index, value) {
    if(!tipeDeposit)
      tipeDeposit = $(value).find('select').val();
  });
  console.log("deposit id "+depositID);
  console.log("jurnal id "+jurnalID);
  console.log("tipe deposit "+tipeDeposit);
  $.post("/transaksi/deposit/editTipe/"+depositID+"/"+jurnalID, {tipe_deposit:tipeDeposit}, function(data, status){
    if(data.status == 'success'){
      Swal.fire({
        position: 'top-end',
        type: 'success',
        title: 'Tipe Deposit berhasil diupdate',
        showConfirmButton: false,
        timer: 2000
      }).then(function(){
        table.ajax.reload( null, false );
        tableJurnal.ajax.reload( null, false );
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
        tableJurnal.ajax.reload( null, false );
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
