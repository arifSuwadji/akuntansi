let table = $('#tableData').DataTable({
  'paging'      : true,
  'lengthChange': true,
  'searching'   : true,
  'ordering'    : true,
  'autoWidth'   : false,
  'info'        : true,
  'processing'  : true,
  'serverSide'  : true,
  'ajax' : '/master/suplier/listJson',
  'columns' : [
    {
      "mRender": function(data, type, full){
        return '<span class="pull-right">'+full['sup_id']+'</span>';
      }
    },
    { "data": "nama_suplier" },

    {
      "mRender": function(data, type, full){
        return '<span class="pull-right"><a href="/master/suplier/mutasi/'+full['sup_id']+'/'+full['nama_suplier']+'">'+toRp(full['saldo_suplier'])+'</a></span>'
      }
    },
    {
      "mRender": function(data, type, full){
        return '<span class="pull-right"><a href="/master/suplier/mutasi_hutang/'+full['sup_id']+'/'+full['nama_suplier']+'">'+toRp(full['saldo_hutang'])+'</a></span>'
      }
    },
    { "mRender": function(data, type, full){
      if(full['akun_persediaan']){
        return '<a href="javascript:void(0);"> <span>'+full['nama_akun_persediaan']+'</span></a>';
      }else{
        return '<select class="form-control select2 tipeDeposit" onchange="updateAkunPersediaan('+full['sup_id']+')" style="width: 100%;" name="akun_persediaan" data-placeholder="Pilih Akun Persediaan"><option></option>'+full['optAkunPersediaan']+'</select>';
      }
    }},
    { "mRender": function(data, type, full){
      if(full['akun_hutang']){
        return '<a href="javascript:void(0);"> <span>'+full['nama_akun_hutang']+'</span></a>';
      }else{
        return '<select class="form-control select2 tipeDeposit" onchange="updateAkunHutang('+full['sup_id']+')" style="width: 100%;" name="akun_hutang" data-placeholder="Pilih Akun Hutang"><option></option>'+full['optAkunHutang']+'</select>';
      }
    }},
  ],
});

function updateAkunPersediaan(supID){
  let tsor = $('#tableData').dataTable();
  let ins = tsor.fnGetData();
  let a = tsor.fnGetNodes();
  let akunPersediaan = null;
  $.each(tsor.fnGetNodes(), function (index, value) {
    if(!akunPersediaan)
      akunPersediaan = $(value).find('select').val();
  });
  console.log("suplier id "+supID);
  console.log("akun persediaan "+akunPersediaan);
  $.post("/master/suplier/list", {sup_id: supID, akun_persediaan:akunPersediaan}, function(data, status){
    if(data.status == 'success'){
      Swal.fire({
        position: 'top-end',
        type: 'success',
        title: 'Akun Persediaan berhasil diupdate',
        showConfirmButton: false,
        timer: 2000
      }).then(function(){
        table.ajax.reload( null, false );
      });
    }else{
      Swal.fire({
        position: 'top-end',
        type: 'error',
        title: 'Akun Persediaan gagal diupdate',
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

function updateAkunHutang(supID){
  let tsor = $('#tableData').dataTable();
  let ins = tsor.fnGetData();
  let a = tsor.fnGetNodes();
  let akunHutang = null;
  $.each(tsor.fnGetNodes(), function (index, value) {
    if(!akunHutang)
      akunHutang = $(value).find('select').val();
  });
  console.log("suplier id "+supID);
  console.log("akun hutang "+akunHutang);
  $.post("/master/suplier/list", {sup_id: supID, akun_hutang:akunHutang}, function(data, status){
    if(data.status == 'success'){
      Swal.fire({
        position: 'top-end',
        type: 'success',
        title: 'Akun Hutang berhasil diupdate',
        showConfirmButton: false,
        timer: 2000
      }).then(function(){
        table.ajax.reload( null, false );
      });
    }else{
      Swal.fire({
        position: 'top-end',
        type: 'error',
        title: 'Akun Hutang gagal diupdate',
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
            /*let column = table.column(6);
            column.visible(!column.visible());*/
        }

        // Executes in XS and SM breakpoints
        if(viewport.is('<md')) {
            // ...
            /*let column = table.column(0);
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
            column.visible(!column.visible());*/
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
