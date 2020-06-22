<?php

$meta= [
  'title' => 'HITS | Yönetici Ekle'
];

if (post('submit')){
  $type = 'admin';
  $username = post('username');
  $firstname = post('firstname');
  $lastname = post('lastname');
  $email = post('email');
  if(!$username || !$email){
    $error = 'Kullanıcı adı veya email boş bırakılamaz!';
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
require root_admin_view('add-admin');

 ?>
