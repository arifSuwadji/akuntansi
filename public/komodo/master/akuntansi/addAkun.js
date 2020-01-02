'use strict';

//'pageLength' : 1,
let table = $('#tableData').DataTable({
  'paging'      : true,
  'lengthChange': false,
  'searching'   : true,
  'ordering'    : true,
  'autoWidth'   : false,
  'info'        : false,
  'processing'  : true,
  'serverSide'  : true,
  'dom' : 't',
  'ajax' : '/master/akuntansi/akunJson',
  "order": [[ 0, "asc" ]],
  'columns' : [
    { "data": "kode_akun" },
    { "data": "nama_akun"},
    { "data": "nama_tipe_akun" },
    {
      "mRender": function(data, type, full) {
        return '<div class="col-md-3">'+' <div class="box box-primary box-solid">'+' <div class="box-header with-border">'+' <h3 class="box-title">'+full['kode_akun']+' - '+full['nama_tipe_akun']+'</h3>'+'<div class="box-tools pull-right">'+' </div>'+' </div>'+' <div class="box-body">'+ full['nama_akun']+' </div>'+' </div>'+' </div>';
      }
    }
  ],
});

function deleteAdmin(id_admin,username){
  Swal.fire({
    title: 'Admin '+username+' akan dihapus?',
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
        $.post("/master/admin/delete/"+id_admin, function(data, status){
          //alert("data "+JSON.stringify(data));
          if(data.status == 'success'){
            Swal.fire({
              position: 'top-end',
              type: 'success',
              title: 'Admin '+username+' telah terhapus',
              showConfirmButton: false,
              timer: 2000
            }).then(function(){
              table.ajax.reload();
            });
          }else{
            Swal.fire({
              position: 'top-end',
              type: 'error',
              title: 'Admin '+username+' tidak terhapus',
              showConfirmButton: false,
              timer: 2000
            }).then(function(){
              table.ajax.reload();
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

$("#kode_akun").on('keyup',function(){
  let valueAkun = $(this).val();
  if(valueAkun.length > 0 ){
    $("#showTables").removeClass('hidden');
  }else{
    $("#showTables").addClass('hidden');
  }
  table.search(valueAkun).draw();
});

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
