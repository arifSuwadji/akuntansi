'use strict';

//'pageLength' : 1,
let table = $('#tableData').DataTable({
  'paging'      : true,
  'lengthChange': true,
  'searching'   : true,
  'ordering'    : true,
  'autoWidth'   : false,
  'info'        : true,
  'processing'  : true,
  'serverSide'  : true,
  'ajax' : '/master/akuntansi/akunJson',
  "order": [[ 1, "asc" ]],
  'columns' : [
    { "data": "hitung"},
    { "data": "kode_akun" },
    { "data": "nama_akun"},
    { "data": "nama_tipe_akun" },
    {
      "mRender": function(data, type, full) {
        return '<a class="btn btn-info btn-xs" href=/master/akuntansi/editakun/' + full['akun_id'] + '>' + 'Edit' + '</a>&emsp;<a class="btn btn-danger btn-xs" onClick=deleteAkun('+full['akun_id']+');'+ '>' + 'Hapus' + '</a>';
      }
    },
    {
      "mRender": function(data, type, full) {
        return '<div class="col-md-3">'+' <div class="box box-primary box-solid">'+' <div class="box-header with-border">'+' <h3 class="box-title">'+full['kode_akun']+'-'+full['nama_tipe_akun']+'</h3>'+'<div class="box-tools pull-right">'+' </div>'+' </div>'+' <div class="box-body"><h5>'+full['nama_akun']+'</h5> <a class="btn btn-info" href=/master/akuntansi/editakun/' + full['akun_id'] + '>' + 'Edit' + '</a>&emsp;<a class="btn btn-danger" onClick=deleteAkun('+full['akun_id']+');'+ '>' + 'Hapus' + '</a> '+' </div>'+' </div>'+' </div>';
      }
    }
  ],
});

function deleteAkun(id_akun){
  Swal.fire({
    title: 'Akun akan dihapus?',
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
        $.post("/master/akuntansi/delete/"+id_akun, function(data, status){
          //alert("data "+JSON.stringify(data));
          if(data.status == 'success'){
            Swal.fire({
              position: 'top-end',
              type: 'success',
              title: 'Akun telah terhapus',
              showConfirmButton: false,
              timer: 2000
            }).then(function(){
              table.ajax.reload();
            });
          }else{
            Swal.fire({
              position: 'top-end',
              type: 'error',
              title: 'Akun tidak terhapus',
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
            let column = table.column(5);
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
