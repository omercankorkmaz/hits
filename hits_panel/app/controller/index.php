<?php

$meta = [
  'title' => 'HITS | Giriş Yap'
];

if (post('submit')){
  $username=post('username');
  $password=post('password');
  $type = post('type');
  if(!$username){
    $error = 'Kullanıcı adı boş bırakılamaz!';
  }
  elseif(!$password){
    $error = 'Şifre boş bırakılamaz!';
  }
  elseif(!$type){
    $error = 'Kullanıcı tipi seçeneği boş bırakılamaz!';
  }
  else{
    if($type == 'adm'){
      Users::Login($username,$password,$type);
    }
    else{
      Users::Login($username,$password,$type);
    }
  }

}

require view('index');

 ?>
