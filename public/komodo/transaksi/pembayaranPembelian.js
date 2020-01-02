"use strict";

let table = $('#tableData').DataTable({
  'paging'      : true,
  'lengthChange': true,
  'searching'   : true,
  'ordering'    : true,
  'autoWidth'   : false,
  'info'        : true,
  'processing'  : true,
  'serverSide'  : true,
  'ajax' : '/transaksi/pembayaran_hutang_dataPembelianJson',
  "dom" : "<'row'<'col-sm-6'l>>" +
"<'row'<'col-sm-12'tr>>" +
"<'row'<'col-sm-5'i><'col-sm-7'p>>",
  'columns' : [
    { "data": "tipe_pembelian"},
    { "data": "tanggalView"},
    { "mRender": function(data, type, full){
      return '<span class="pull-right">'+toRp(full['nominal'])+'</span>'
    }},
    { "mRender": function(data, type, full){
      return '<span class="pull-right">'+toRp(full['nominal_diskon'])+'</span>'
    }},
    { "mRender": function(data, type, full){
      return '<span class="pull-right">'+toRp(full['nominal'] - full['sisa_pembayaran'])+'</span>'
    }},
    { "mRender": function(data, type, full){
      return '<span class="pull-right">'+toRp(full['sisa_pembayaran'])+'</span>'
    }},
    { "mRender": function(data, type, full){
      return '<input type="radio" name="idPembayaran" onClick="pembelian('+full['pembelian_id']+','+full['sisa_pembayaran']+')">'
    }}
  ]
});

function pembelian(pembelian_id, hutangPembelian){
  console.log("id pembelian "+pembelian_id);
  console.log("hutang pembeian "+hutangPembelian);
  $("#pembelianId").val(pembelian_id);
  $("#saldoHutangPembelian").val(hutangPembelian);
  $("#saldoHutangPembelian").focus();
  $("#nominal").focus();
}

$(document).ready(function(){
  setTimeout(function(){
    let dmy1 = $("#dmy1").val();
    $.get("/transaksi/pembayaran_hutang_suplier_getFaktur/PPH/"+dmy1, function(data, status){
      console.log(JSON.stringify(data));
      console.log(data.message);
      $("#faktur").val(data.message);
    }).fail(function(){
      Swal.fire({
        position: 'top-end',
        type: 'warning',
        title: 'tidak bisa menampilkan faktur',
        showConfirmButton: false,
        timer: 3000
      });
    });

    $.get("/transaksi/pembayaran_hutang_suplierJson", function(data, status){
      //console.log("data "+JSON.stringify(data));
      let response = data.message;
      $(".suplier #optSuplier").remove();
      $(".suplier").append("<option  id='optSuplier' value=''></option>");
      $.each(data.message, function(index, value){
        //console.log("response "+value.member_id+" : "+value.nama);
        $(".suplier").append("<option id='optSuplier' value='"+value.sup_id+"'>"+value.nama_suplier+"</option>");
      });
    }).fail(function(){
      Swal.fire({
        position: 'top-end',
        type: 'warning',
        title: 'tidak bisa menampilkan suplier',
        showConfirmButton: false,
        timer: 3000
      });
    });
  }, 500);

  $(".akun_kredit").on("select2:select", function(){
    console.log("akun kredit "+$(this).val());
  });

  $(".suplier").on("select2:select", function(){
    let suplierID = $(this).val();
    $.get("/transaksi/pembayaran_hutang_suplierByID/"+suplierID, function(data, status){
      //console.log("data suplier "+JSON.stringify(data.message));
      //console.log("akun persediaan "+data.message[0].akun_persediaan);
      let akunHutang = data.message[0].akun_hutang;
      $("#saldoHutang").val(data.message[0].saldo_hutang);
      $("#saldoHutang").focus();
      $(".akun_kredit").focus();
      $.get("/transaksi/pembayaran_hutang_suplier_akunJson", function(data, status){
        let response = data.message;
        $(".akun_debit #optDebit").remove();
        $(".akun_kredit #optKredit").remove();
        $(".akun_debit").append("<option  id='optDebit' value=''></option>");
        $(".akun_kredit").append("<option  id='optKredit' value=''></option>");
        $.each(data.message, function(index, value){
          //console.log("response "+value.akun_id+" : "+value.kode_akun+' '+value.nama_akun);
          if(value.akun_id == akunHutang){
            console.log("akun persediaan "+akunHutang);
            $(".akun_debit").append("<option id='optDebit' value='"+value.akun_id+"' selected>"+value.kode_akun+" - "+value.nama_akun+"</option>");
            $(".akun_kredit").append("<option id='optKredit' value='"+value.akun_id+"'>"+value.kode_akun+" - "+value.nama_akun+"</option>");
          }else{
            $(".akun_debit").append("<option id='optDebit' value='"+value.akun_id+"'>"+value.kode_akun+" - "+value.nama_akun+"</option>");
            $(".akun_kredit").append("<option id='optKredit' value='"+value.akun_id+"'>"+value.kode_akun+" - "+value.nama_akun+"</option>");
          }
        })
      }).fail(function(){
        Swal.fire({
          position: 'top-end',
          type: 'warning',
          title: 'tidak bisa menampilkan akun perkiraan',
          showConfirmButton: false,
          timer: 3000
        });
      });
    })
    table.search(suplierID).draw();
  });

  $("#nominal").on('blur', function(){
    console.log("nominal blur");
    let nominal = parseCurrency($(this).val());
    let saldoHutang = parseCurrency($("#saldoHutangPembelian").val());
    console.log("nominal "+nominal);
    console.log("saldo hutang pembelian "+saldoHutang);
    let sisa = saldoHutang - nominal;
    console.log("sisa "+sisa);
    $("#sisa").val(sisa);
  });

  $("#submitBayar").on("click", function(event){
    event.preventDefault();
    let suplier = $(".suplier").val();
    let akun_debit = $(".akun_debit").val();
    let akun_kredit = $(".akun_kredit").val();
    let nominal = $('#nominal').val(); if(nominal){ parseCurrency($("#nominal").val()) };
    let keterangan = $("#ket_bayar").val();
    let pembelianId = $("#pembelianId").val();
    if(!suplier){
      Swal.fire({
        position: 'top-end',
        type: 'warning',
        title: 'suplier belum dipilih',
        showConfirmButton: false,
        timer: 3000
      });
    }else if(!akun_debit){
      Swal.fire({
        position: 'top-end',
        type: 'warning',
        title: 'akun debit belum dipilih',
        showConfirmButton: false,
        timer: 3000
      });
    }else if(!akun_kredit){
      Swal.fire({
        position: 'top-end',
        type: 'warning',
        title: 'akun kredit belum dipilih',
        showConfirmButton: false,
        timer: 3000
      });
    }else if(!pembelianId){
      Swal.fire({
        position: 'top-end',
        type: 'warning',
        title: 'pembelian yang akan dibayar belum dipilih',
        showConfirmButton: false,
        timer: 3000
      });
    }else if(!nominal || nominal == 0){
      Swal.fire({
        position: 'top-end',
        type: 'warning',
        title: 'nominal belum diisi',
        showConfirmButton: false,
        timer: 3000
      });
    }else if(!keterangan){
      Swal.fire({
        position: 'top-end',
        type: 'warning',
        title: 'keterangan belum diisi',
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
});
$("#nominal").priceFormat({ prefix: '', centsLimit: 0});
$("#saldoHutang").priceFormat({ prefix: '', centsLimit: 0});
$("#saldoHutangPembelian").priceFormat({ prefix: '', centsLimit: 0});
$("#sisa").priceFormat({ prefix: '', centsLimit: 0});


function parseCurrency( num ) {
  return parseFloat( num.replace( /,/g, '') );
}

function toRp(a,b,c,d,e){e=function(f){return f.split('').reverse().join('')};b=e(parseInt(a,10).toString());for(c=0,d='';c<b.length;c++){d+=b[c];if((c+1)%3===0&&c!==(b.length-1)){d+=',';}}return'\t'+e(d)+''}
