'use strict';

$('#editAdmin').on('click', function(event){
  event.preventDefault();
  let password = $('#inputPassword3').val();
  let konfirmasiPassword = $('#konfirmasiPassword').val();
  let namalengkap = $('#nama_lengkap').val();
  let username = $('#username').val();
  if(!namalengkap){
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
