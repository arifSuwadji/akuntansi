"use strict";

$(document).ready(function(){
  setTimeout(function(){
    let dmy1 = $("#dmy1").val();
    $.get("/transaksi/pembayaran_getFaktur/PH/"+dmy1, function(data, status){
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

    $.get("/transaksi/pembayaran_memberJson", function(data, status){
      //console.log("data "+JSON.stringify(data));
      let response = data.message;
      $(".member #optMember").remove();
      $(".member").append("<option  id='optMember' value=''></option>");
      $.each(data.message, function(index, value){
        //console.log("response "+value.member_id+" : "+value.nama);
        if(value.saldo_hutang > 0){
          $(".member").append("<option id='optMember' value='"+value.member_id+"'>"+value.nama+"</option>");
        }
      });
    }).fail(function(){
      Swal.fire({
        position: 'top-end',
        type: 'warning',
        title: 'tidak bisa menampilkan member',
        showConfirmButton: false,
        timer: 3000
      });
    });

    $.get("/transaksi/pembayaran_akunJson", function(data, status){
      let response = data.message;
      $(".akun_debit #optDebit").remove();
      $(".akun_kredit #optKredit").remove();
      $(".akun_debit").append("<option  id='optDebit' value=''></option>");
      $(".akun_kredit").append("<option  id='optKredit' value=''></option>");
      $.each(data.message, function(index, value){
        //console.log("response "+value.akun_id+" : "+value.kode_akun+' '+value.nama_akun);
        if(value.akun_id == 27){
          $(".akun_kredit").append("<option id='optKredit' value='"+value.akun_id+"' selected>"+value.kode_akun+" - "+value.nama_akun+"</option>");
        }else{
          if(value.kode_akun == '1.100.10' || value.kode_akun == '1.500.10' || value.kode_akun == '1.500.20' || value.kode_akun == '1.500.30' || value.kode_akun == '1.500.40'){
            $(".akun_debit").append("<option id='optDebit' value='"+value.akun_id+"'>"+value.kode_akun+" - "+value.nama_akun+"</option>");
          }
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
  }, 500);

  $(".member").on("select2:select", function(){
    let memberID = $(this).val();
    $.get("/transaksi/pembayaran_saldoMember/"+memberID, function(data, status){
      console.log("data saldo "+data.message);
      $("#saldo_hutang").val(data.message);
      $(".idr_currency").text(toRp(data.message));
    })
  });

  $("#submitBayar").on("click", function(event){
    event.preventDefault();
    let member = $(".member").val();
    let saldo_hutang = $("#saldo_hutang").val();
    let akun_debit = $(".akun_debit").val();
    let akun_kredit = $(".akun_kredit").val();
    let nominal = parseCurrency($("#nominal").val());
    let keterangan = $("#ket_bayar").val();
    if(!member){
      Swal.fire({
        position: 'top-end',
        type: 'warning',
        title: 'member belum dipilih',
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
    }else if(!nominal){
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
    }else if(nominal > saldo_hutang){
      Swal.fire({
        position: 'top-end',
        type: 'warning',
        title: 'nominal melebihi saldo hutang',
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

function parseCurrency( num ) {
  return parseFloat( num.replace( /,/g, '') );
}

function toRp(a,b,c,d,e){e=function(f){return f.split('').reverse().join('')};b=e(parseInt(a,10).toString());for(c=0,d='';c<b.length;c++){d+=b[c];if((c+1)%3===0&&c!==(b.length-1)){d+=',';}}return'\t'+e(d)+''}
