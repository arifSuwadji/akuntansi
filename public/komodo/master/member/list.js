let table = $('#tableData').DataTable({
  'paging'      : true,
  'lengthChange': true,
  'searching'   : true,
  'ordering'    : true,
  'autoWidth'   : false,
  'info'        : true,
  'processing'  : true,
  'serverSide'  : true,
  'ajax' : '/master/member/listJson',
  'columns' : [
    {
      "mRender": function(data, type, full){
        return '<span class="pull-right">'+full['member_id']+'</span>';
      }
    },
    {
      "mRender": function(data, type, full){
        return '<span class="pull-right">'+full['komodo_id']+'</span>';
      }
    },
    { "data": "nama" },
    { "data": "nama_lengkap"},
    {
      "mRender": function(data, type, full){
        return '<span class="pull-right"><a href="/master/member/mutasi_hutang/'+full['member_id']+'/'+full['nama']+'">'+toRp(full['saldo_hutang'])+'</a></span>'
      }
    },
    {
      "mRender": function(data, type, full) {
        return '<span class="pull-right">'+toRp(full['limit_hutang'])+'</span>';
      }
    },
    {
      "mRender": function(data, type, full) {
        return '<div class="col-md-3">'+' <div class="box box-primary box-solid">'+' <div class="box-header with-border">'+' <h3 class="box-title">'+full['nama']+'</h3>'+'<div class="box-tools pull-right">'+' </div>'+' </div>'+' <div class="box-body">'+'Saldo Hutang: <a href="/master/member/mutasi_hutang/' + full['member_id'] + '/'+full['nama']+'">' + toRp(full['saldo_hutang']) + '</a> <br/>Limit Hutang: '+toRp(full['limit_hutang'])+'</div>'+' </div>'+' </div>';
      }
    }
  ],
});

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
            let column = table.column(6);
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
