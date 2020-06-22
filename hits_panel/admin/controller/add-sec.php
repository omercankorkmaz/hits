<?php

$meta= [
  'title' => 'HITS | Sekreter Ekle'
];

if (post('submit')){
  $type = 'sec';
  $username = post('username');
  $firstname= post('firstname');
  $lastname = post('lastname');
  $email = post('email');
  if(!$username){
    $error = 'Kullanıcı adı boş bırakılamaz!';
  }
  elseif(!$firstname || !$lastname){
    $error = 'Ad veya soyadı boş bırakılamaz!';
  }
  else{
    $res = Users::AddUser($username, $firstname, $lastname, Encryption::encrypt($email), $type);
  }

}

if(isset($res)){
  if($res){
    $success = 'İşlem başarılı!';
  }
  if(!$res){
    $error = 'İşlem başarısız';
  }
}
require admin_view('add-sec');

 ?>
