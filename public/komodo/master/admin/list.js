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
  'ajax' : '/master/admin/listJson',
  'columns' : [
    { "data": "hitung"},
    { "data": "username" },
    { "data": "nama_lengkap"},
    { "data": "nama_grup" },
    {
      "mRender": function(data, type, full){
        if(full['kode_akun']){
          return full['kode_akun']+' - '+full['nama_akun'];
        }else{
          return '';
        }
      }
    },
    { "data": "status_admin" },
    {
      "mRender": function(data, type, full) {
        return '<a class="btn btn-info btn-xs" href=/master/admin/edit/' + full['admin_id'] + '?grup_id='+ full['grup_id'] + '>' + 'Edit' + '</a>&emsp;<a class="btn btn-danger btn-xs" onClick=deleteAdmin('+full['admin_id']+',"'+full['username']+'");'+ '>' + 'Hapus' + '</a>';
      }
    },
    {
      "mRender": function(data, type, full) {
        return '<div class="col-md-3">'+' <div class="box box-primary box-solid">'+' <div class="box-header with-border">'+' <h3 class="box-title">'+full['nama_lengkap']+'</h3>'+'<div class="box-tools pull-right">'+' </div>'+' </div>'+' <div class="box-body">'+' <a class="btn btn-info" href=/master/admin/edit/' + full['admin_id'] + '?grup_id='+ full['grup_id'] + '>' + 'Edit' + '</a>&emsp;<a class="btn btn-danger" onClick=deleteAdmin('+full['admin_id']+',"'+full['username']+'");'+ '>' + 'Hapus' + '</a> '+' </div>'+' </div>'+' </div>';
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
