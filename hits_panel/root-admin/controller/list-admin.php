<?php

$meta = [
  'title' => 'HITS | Yöneticileri Listele'
];


$query = Users::ListUser('admin');

if (isset($_POST['submit']) && $_POST['submit']=='change'){
  $userid = $_POST['val'];
  if($userid == 1){
    $password = $_POST['password'];
    $res = Users::UpdateUser($userid,$password,'admin');
  }
  else{
    $code = $_POST['code'];
    $real_code = $_SESSION['real_code'];
    $to = $_SESSION['to_user'];
    $res = Users::ResetPassword($to, $userid, $code, $real_code, 'admin');
  }
}
elseif (isset($_POST['delete']) && $_POST['delete'] == 'del'){
  $userid = $_POST['val'];
  $res = Users::DelUser($userid,'admin');
}

if(isset($res)){
  if($res){
    $success = 'İşlem başarılı!';
    header("Refresh:0");
  }
  if(!$res){
    $error = 'İşlem başarısız';
  }
}


require root_admin_view('list-admin');

 ?>
