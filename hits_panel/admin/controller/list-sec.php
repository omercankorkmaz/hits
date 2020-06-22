<?php

$meta = [
  'title' => 'HITS | Sekreterleri Listele'
];

if (isset($_POST['submit']) && $_POST['submit'] == 'change'){
  $userid = $_POST['val'];
  $code = $_POST['code'];
  $real_code = $_SESSION['real_code'];
  $to = $_SESSION['to_user'];
  $res = Users::ResetPassword($to, $userid, $code, $real_code, 'sec');
}
else if (isset($_POST['delete']) && $_POST['delete'] == 'del'){
  $userid = $_POST['val'];
  $res = Users::DelUser($userid,'sec');
}

if(isset($res)){
  if($res){
    $success = 'İşlem başarılı!';
  }
  if(!$res){
    $error = 'İşlem başarısız';
  }
}


require admin_view('list-sec');

 ?>
