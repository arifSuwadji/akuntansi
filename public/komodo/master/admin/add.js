'use strict';

$('#addAdmin').on('click', function(event){
  event.preventDefault();
  let password = $('#inputPassword3').val();
  let konfirmasiPassword = $('#konfirmasiPassword').val();
  let admin_grup = $('#admin_grup').val();
  let namalengkap = $('#nama_lengkap').val();
  let username = $('#username').val();
  let dataAkun = $('#data_akun').val();
  if(!admin_grup){
    Swal.fire({
      position: 'top-end',
      type: 'warning',
      title: 'Admin grup belum dipilih',
      showConfirmButton: false,
      timer: 3000
    });
  }else if(!dataAkun){
      Swal.fire({
        position: 'top-end',
        type: 'warning',
        title: 'Akun Perkiraan belum dipilih',
        showConfirmButton: false,
        timer: 3000
      });
  }else if(!namalengkap){
    Swal.fire({
      position: 'top-end',
      type: 'warning',
      title: 'Nama Lengkap belum diisi',
      showConfirmButton: false,
      timer: 3000
    });
  }else if(!username){
    Swal.fire({
      position: 'top-end',
      type: 'warning',
      title: 'Username belum diisi',
      showConfirmButton: false,
      timer: 3000
    });
  }else if(!password){
    Swal.fire({
      position: 'top-end',
      type: 'warning',
      title: 'Password belum diisi',
      showConfirmButton: false,
      timer: 3000
    });
  }else{
    if(password != konfirmasiPassword){
      Swal.fire({
        position: 'top-end',
        type: 'warning',
        title: 'Password tidak sama',
        showConfirmButton: false,
        timer: 3000
      });
    }else{
      $('form').submit();
    }
  }
});
