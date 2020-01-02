"use strict";

$(document).ready(function(){
  setTimeout(function(){
    let dmy1 = $("#dmy1").val();
    $.get("/transaksi/pembelian_getFaktur/PB/"+dmy1, function(data, status){
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

    $.get("/transaksi/pembelian_suplierJson", function(data, status){
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

  $(".tipe_pembelian").on("select2:select", function(){
    console.log("tipe pembelian "+$(this).val());
    if($(this).val() == 'hutang'){
      let suplierID = $(".suplier").val();
      $.get("/transaksi/pembelian_suplierByID/"+suplierID, function(data, status){
        //console.log("data suplier "+JSON.stringify(data.message));
        //console.log("akun persediaan "+data.message[0].akun_persediaan);
        let akunHutang = data.message[0].akun_hutang;
        $.get("/transaksi/pembelian_akunJson", function(data, status){
          let response = data.message;
          $(".akun_kredit #optKredit").remove();
          $(".akun_kredit").append("<option  id='optKredit' value=''></option>");
          $.each(data.message, function(index, value){
            //console.log("response "+value.akun_id+" : "+value.kode_akun+' '+value.nama_akun);
            if(value.akun_id == akunHutang){
              console.log("akun persediaan "+akunHutang);
              $(".akun_kredit").append("<option id='optKredit' value='"+value.akun_id+"' selected>"+value.kode_akun+" - "+value.nama_akun+"</option>");
            }else{
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
    }
  })

  $(".suplier").on("select2:select", function(){
    let suplierID = $(this).val();
    $.get("/transaksi/pembelian_suplierByID/"+suplierID, function(data, status){
      //console.log("data suplier "+JSON.stringify(data.message));
      //console.log("akun persediaan "+data.message[0].akun_persediaan);
      let akunPersediaan = data.message[0].akun_persediaan;
      $.get("/transaksi/pembelian_akunJson", function(data, status){
        let response = data.message;
        $(".akun_debit #optDebit").remove();
        $(".akun_kredit #optKredit").remove();
        $(".akun_diskon #optDiskon").remove();
        $(".akun_debit").append("<option  id='optDebit' value=''></option>");
        $(".akun_kredit").append("<option  id='optKredit' value=''></option>");
        $(".akun_diskon").append("<option  id='optDiskon' value=''></option>");
        $.each(data.message, function(index, value){
          //console.log("response "+value.akun_id+" : "+value.kode_akun+' '+value.nama_akun);
          if(value.akun_id == akunPersediaan){
            console.log("akun persediaan "+akunPersediaan);
            $(".akun_debit").append("<option id='optDebit' value='"+value.akun_id+"' selected>"+value.kode_akun+" - "+value.nama_akun+"</option>");
            if(value.kode_akun == '1.100.10' || value.kode_akun == '1.500.10' || value.kode_akun == '1.500.20' || value.kode_akun == '1.500.30' || value.kode_akun == '1.500.40'){
              $(".akun_kredit").append("<option id='optKredit' value='"+value.akun_id+"'>"+value.kode_akun+" - "+value.nama_akun+"</option>");
            }
            $(".akun_diskon").append("<option id='optDiskon' value='"+value.akun_id+"'>"+value.kode_akun+" - "+value.nama_akun+"</option>");
          }else{
            $(".akun_debit").append("<option id='optDebit' value='"+value.akun_id+"'>"+value.kode_akun+" - "+value.nama_akun+"</option>");
            if(value.kode_akun == '1.100.10' || value.kode_akun == '1.500.10' || value.kode_akun == '1.500.20' || value.kode_akun == '1.500.30' || value.kode_akun == '1.500.40'){
              $(".akun_kredit").append("<option id='optKredit' value='"+value.akun_id+"'>"+value.kode_akun+" - "+value.nama_akun+"</option>");
            }
            $(".akun_diskon").append("<option id='optDiskon' value='"+value.akun_id+"'>"+value.kode_akun+" - "+value.nama_akun+"</option>");
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
  });

  $("#submitBeli").on("click", function(event){
    event.preventDefault();
    let suplier = $(".suplier").val();
    let akun_debit = $(".akun_debit").val();
    let akun_kredit = $(".akun_kredit").val();
    let akun_diskon = $(".akun_diskon").val();
    let tipe_pembelian = $(".tipe_pembelian").val();
    let nominal = parseCurrency($("#nominal").val());
    let diskon = parseCurrency($("#diskon").val());
    let keterangan = $("#ket_beli").val();
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
    }else if(!tipe_pembelian){
      Swal.fire({
        position: 'top-end',
        type: 'warning',
        title: 'tipe pembelian belum dipilih',
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
    }else{
      if(diskon && !akun_diskon){
        Swal.fire({
          position: 'top-end',
          type: 'warning',
          title: 'akun diskon belum dipilih',
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
    }
  });
});
$("#nominal").priceFormat({ prefix: '', centsLimit: 0});
$("#diskon").priceFormat({ prefix: '', centsLimit: 0});

function parseCurrency( num ) {
  return parseFloat( num.replace( /,/g, '') );
}

function toRp(a,b,c,d,e){e=function(f){return f.split('').reverse().join('')};b=e(parseInt(a,10).toString());for(c=0,d='';c<b.length;c++){d+=b[c];if((c+1)%3===0&&c!==(b.length-1)){d+=',';}}return'\t'+e(d)+''}
