<?php

$meta = [
  'title' => 'HITS | Ayarlar'
];

if (isset($_POST['submit']) && $_POST['submit']=='change'){
  $password = $_POST['password'];
  $password2 = $_POST['password2'];
  $password3 = $_POST['password3'];
  if($password || $password2 || $password3){
    if(Users::ChangePassCheck($_SESSION['user_id'], $password, $password2, $password3, 'sec')){
    $res = Users::UpdateUser($_SESSION['user_id'],$password2,'sec');
  }
}
else{
  $error = 'Şifre kısımları boş bırakılamaz!';
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

require sec_view('settings');

 ?>
